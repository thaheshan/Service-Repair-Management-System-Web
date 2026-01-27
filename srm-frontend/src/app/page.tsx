'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/Splash_Screen/SplashScreen';
import RoleSelection from '@/components/Splash_Screen/RoleSelection';

type AppScreen = 'splash' | 'role-selection';

export default function Home() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');

  const handleSplashComplete = () => {
    setCurrentScreen('role-selection');
  };

  const handleRoleSelect = (roleId: string) => {
    console.log('User selected role:', roleId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', roleId);
    }
    router.push('/login');
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
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}
    </div>
  );
}