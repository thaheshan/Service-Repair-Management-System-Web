import { create } from "zustand";
import { persist } from "zustand/middleware";
import { post } from "@/api/client";
import { TOKEN_KEY } from "@/constants/api";
import { AuthUser, UserRole } from "@/types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  registerShop: (data: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  clearError: () => void;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await post<{ success: boolean; data: { tokens: { accessToken: string; refreshToken: string; }; user: AuthUser } }>("/auth/login", {
            email,
            password,
          });
          
          const token = res.data.tokens.accessToken;
          // Normalize role to lowercase so it matches the frontend UserRole type
          const user = {
            ...res.data.user,
            role: res.data.user.role.toLowerCase() as any,
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
            // Also store in cookie so Next.js middleware can read it for route protection
            document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          }
          
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || "Login failed",
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      registerShop: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Generate IDs using shopName and email
          const generateResponse = await post<{ success: boolean; data: { shop_id: string; tenant_id: string } }>("/shops/generate-ids", {
            shop_name: data.shopName,
            owner_email: data.email,
          });

          if (!generateResponse || !generateResponse.data) {
            throw new Error("Failed to generate shop IDs");
          }
          
          const { shop_id, tenant_id } = generateResponse.data;

          // 2. Submit onboarding request instead of direct registration
          const registrationPayload = {
            shop_id,
            tenant_id,
            shop_name: data.shopName,
            brn: data.businessRegNumber || undefined,
            address: data.address || undefined,
            city: data.city || undefined,
            country: data.country || undefined,
            phone: (data.phoneCode && data.phone) ? `${data.phoneCode}${data.phone}` : data.phone || undefined,
            branches: data.branches || undefined,
            repairTypes: data.repairTypes || [],
            plan: data.selectedPlan || undefined,
            owner: {
              name: data.ownerName,
              email: data.email,
              password: data.password,
            }
          };

          const result = await post<{ requestId: string; status: string }>("/onboarding/request", registrationPayload);
          
          set({ isLoading: false });
          return result; // Return requestId to the UI
        } catch (error: any) {
          set({
            error: error.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await post<any>("/auth/forgot-password", { email });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to process forgot password request",
            isLoading: false,
          });
          throw error;
        }
      },

      resetPassword: async (token: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await post<any>("/auth/reset-password", { token, password });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to reset password",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
          // Also clear the cookie used by Next.js middleware
          document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
        }
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      clearError: () => set({ error: null }),
      
      hasRole: (role) => get().user?.role === role,
    }),
    {
      name: "srm-auth", // storage key
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
