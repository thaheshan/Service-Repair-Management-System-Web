import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthInit } from '../../hooks/useAuthInit';
import { ProtectedRoute } from '../../components/protected-routes';
import { NoAuthRoute } from '../../components/no-auth-routes';
import SplashScreen from './SplashScreen';
import RoleSelection from './RoleSelection';
import  LoadingScreen  from '../../components/Splash_Screen/SplashScreen';
import { useAuthStore } from '../../store/authStore';
import './App.scss';

type AppScreen = 'splash' | 'role-selection' | 'main';

const App: React.FC = () => {
  // ==================== AUTHENTICATION INIT ====================
  // Initialize auth on app startup
  useAuthInit();

  // ==================== AUTH STATE ====================
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // ==================== LOCAL STATE ====================
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // ==================== EFFECTS ====================
  /**
   * Sync auth state with local UI state
   * When user logs out, reset to splash
   */
  useEffect(() => {
    if (!isAuthenticated && currentScreen !== 'splash') {
      setCurrentScreen('splash');
      setSelectedRole(null);
    }
  }, [isAuthenticated, currentScreen]);

  // ==================== HANDLERS ====================
  const handleSplashComplete = () => {
    console.log('[App] Splash complete, moving to role selection');
    setCurrentScreen('role-selection');
  };

  const handleRoleSelect = (roleId: string) => {
    console.log('[App] User selected role:', roleId);
    setSelectedRole(roleId);
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    console.log('[App] Logout clicked');
    logout();
    setCurrentScreen('splash');
    setSelectedRole(null);
  };

  // ==================== SPLASH & ROLE SELECTION FLOW ====================
  // This is shown to users BEFORE they authenticate
  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  // User not authenticated - show splash and role selection flow
  if (!isAuthenticated) {
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
  }

  // ==================== AUTHENTICATED ROUTES ====================
  // User is authenticated - show routing system
  return (
    <Router>
      <Routes>
        {/* Entry point */}
        <Route
          path="/"
          element={
            <div className="app">
              <div className="app__content">
                <h1>Welcome to SRM</h1>
                <p>Your Service Repair Management System</p>
                {user && (
                  <div className="app__role-info">
                    <p>You are logged in as: <strong>{user.role}</strong></p>
                    <p>Name: <strong>{user.name}</strong></p>
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  className="app__logout-btn"
                >
                  Logout
                </button>
              </div>
            </div>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <div className="app">
                <div className="app__content">
                  <h1>Admin Dashboard</h1>
                  <p>Welcome to the admin panel</p>
                  {user && (
                    <div className="app__role-info">
                      <p>Logged in as: <strong>{user.name}</strong></p>
                      <p>Role: <strong>{user.role}</strong></p>
                    </div>
                  )}
                  <nav className="app__nav">
                    <a href="/">Home</a>
                    <button onClick={handleLogout}>Logout</button>
                  </nav>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* User Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute requiredRoles={['user', 'admin']}>
              <div className="app">
                <div className="app__content">
                  <h1>User Dashboard</h1>
                  <p>Welcome to your dashboard</p>
                  {user && (
                    <div className="app__role-info">
                      <p>Logged in as: <strong>{user.name}</strong></p>
                      <p>Role: <strong>{user.role}</strong></p>
                    </div>
                  )}
                  <nav className="app__nav">
                    <a href="/">Home</a>
                    <button onClick={handleLogout}>Logout</button>
                  </nav>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div className="app">
              <div className="app__content">
                <h1>Unauthorized Access</h1>
                <p>You do not have permission to access this page.</p>
                <nav className="app__nav">
                  <a href="/">Go Home</a>
                  <button onClick={handleLogout}>Logout</button>
                </nav>
              </div>
            </div>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;