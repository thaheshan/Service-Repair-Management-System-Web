'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/Splash_Screen/SplashScreen';
import SRMMarketingPage from '@/components/marketing/marketing-page';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

type AppScreen = 'splash' | 'role-selection';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');

  const handleSplashComplete = () => {
    if (isAuthenticated && user) {
      // Skip role selection - go directly to role dashboard
      const dashboardMap: Record<UserRole, string> = {
        admin: "/admin/dashboard",
        manager: "/manager/dashboard",
        technician: "/technician/dashboard",
        customer: "/customer/dashboard",
      };
      router.push(dashboardMap[user.role]);
    } else {
      setCurrentScreen('role-selection');
    }
  };

  return (
    <div className="app">
      {currentScreen === 'splash' && (
        <SplashScreen
          onComplete={handleSplashComplete}
          duration={3000}
        />
      )}
      {currentScreen === 'role-selection' && (
        <SRMMarketingPage />
      )}
    </div>
  );
}