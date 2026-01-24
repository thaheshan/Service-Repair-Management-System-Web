import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import RoleSelection from './RoleSelection';
import './App.scss';

type AppScreen = 'splash' | 'role-selection' | 'main';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleSplashComplete = () => {
    setCurrentScreen('role-selection');
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setCurrentScreen('main');
    console.log('User selected role:', roleId);
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
      {currentScreen === 'main' && (
        <div className="app__content">
          <h1>Welcome to SRM</h1>
          <p>Your Service Repair Management System</p>
          <div className="app__role-info">
            <p>You are logged in as: <strong>{selectedRole}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
