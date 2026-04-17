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
          const res = await post<{ token: string; user: AuthUser }>("/auth/login", {
            email,
            password,
          });
          
          if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, res.token);
          }
          
          set({
            token: res.token,
            user: res.user,
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
          const res = await post<{ token: string; user: AuthUser }>("/auth/register/shop", data);

          if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, res.token);
          }

          set({
            token: res.token,
            user: res.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || "Registration failed",
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
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
