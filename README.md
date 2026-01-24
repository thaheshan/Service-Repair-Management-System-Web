# SRM Splash Screen & Role Selection

A complete onboarding flow for the Service Repair Management application, featuring an animated splash screen followed by role selection, built with React, TypeScript, and SCSS.

## Features

### Splash Screen
- ✨ Smooth animations and transitions
- 📱 Fully responsive design
- 🎨 Beautiful gradient background with animated patterns
- ⚡ Progress bar with shimmer effect (0-100%)
- 🔄 Automatic redirect to Role Selection upon completion

### Role Selection
- 🎯 Interactive role cards (Admin, Technician, Customer, Manager)
- ✅ Visual selection feedback
- 🎨 Matching gradient design
- 📱 Responsive grid layout
- ⚡ Smooth animations and transitions

### Technical
- 🔧 TypeScript support
- 💪 Zero dependencies (besides React)
- 🎯 Type-safe props and state management
- 🚀 Production-ready code

## Installation

1. Copy the following files to your project:
   - `SplashScreen.tsx` & `SplashScreen.scss`
   - `RoleSelection.tsx` & `RoleSelection.scss`
   - `App.tsx` & `App.scss` (or integrate into your existing App)

2. Make sure you have SCSS support configured in your project.

## Complete Flow

The application follows this user journey:

1. **Splash Screen** (3 seconds) → Shows SRM logo with percentage loader
2. **Role Selection** → User selects their entry point (role)
3. **Main Application** → User enters app based on selected role

## Basic Usage

```tsx
import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import RoleSelection from './components/RoleSelection';

type AppScreen = 'splash' | 'role-selection' | 'main';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleSplashComplete = () => {
    setCurrentScreen('role-selection');
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setCurrentScreen('main');
    // Initialize app based on role
  };

  return (
    <>
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} duration={3000} />
      )}
      
      {currentScreen === 'role-selection' && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}
      
      {currentScreen === 'main' && (
        <YourMainApp role={selectedRole} />
      )}
    </>
  );
}
```

## Component APIs

### SplashScreen Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onComplete` | `() => void` | `undefined` | Callback when splash completes (at 100%) |
| `duration` | `number` | `3000` | Duration in milliseconds |

### RoleSelection Props

| Prop | Type | Description |
|------|------|-------------|
| `onRoleSelect` | `(roleId: string) => void` | Callback when user selects a role |

### Available Roles

The default roles included are:
- `admin` - Administrator (Full system access)
- `technician` - Technician (Manage repairs)
- `customer` - Customer (Track repairs)
- `manager` - Manager (Oversee operations)

## Customization

### Change Roles

Edit the `roles` array in `RoleSelection.tsx`:

```tsx
const roles: Role[] = [
  {
    id: 'your-role-id',
    title: 'Your Role Title',
    description: 'Role description',
    icon: '🎯' // Any emoji or text
  },
  // Add more roles...
];
```

### Change Colors

Both components use the same color scheme. Edit variables in the SCSS files:

```scss
$primary-color: #5B4FE9;
$gradient-start: #4F46E5;
$gradient-end: #7C3AED;
```

### Change Splash Duration

```tsx
<SplashScreen duration={5000} /> // 5 seconds
```

### Change Splash Text

Modify text in `SplashScreen.tsx`:

```tsx
<h1 className="splash-screen__title">YOUR APP</h1>
<p className="splash-screen__subtitle">Your Subtitle</p>
<p className="splash-screen__tagline">Your Tagline</p>
```

## Advanced Usage

### With React Router

```tsx
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [screen, setScreen] = useState<'splash' | 'role'>('splash');
  const navigate = useNavigate();

  const handleRoleSelect = (roleId: string) => {
    setShowOnboarding(false);
    // Navigate based on role
    navigate(`/${roleId}/dashboard`);
  };

  if (showOnboarding) {
    return screen === 'splash' 
      ? <SplashScreen onComplete={() => setScreen('role')} />
      : <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
      {/* More routes... */}
    </Routes>
  );
}
```

### With Authentication

```tsx
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');

  const handleRoleSelect = async (roleId: string) => {
    try {
      // Authenticate user with selected role
      await authenticateUser(roleId);
      setIsAuthenticated(true);
      setCurrentScreen('main');
    } catch (error) {
      console.error('Authentication failed');
    }
  };

  // Rest of implementation...
}
```

### Persist Role Selection

```tsx
import { useEffect } from 'react';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');

  useEffect(() => {
    // Check if user already selected a role
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setCurrentScreen('main');
    }
  }, []);

  const handleRoleSelect = (roleId: string) => {
    localStorage.setItem('userRole', roleId);
    setCurrentScreen('main');
  };

  // Rest of implementation...
}
```

## Task Requirements Met

✅ **Story Points**: 3  
✅ **Feature**: Application Initialization  
✅ **Scenario**: User opens application and selects entry point  
✅ **Given**: Application is launched  
✅ **When**: App initialization starts  
✅ **Then**: Show splash screen with SRM logo and percentage loader  
✅ **And**: Redirect to Role Selection screen upon 100% completion  

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
src/
├── components/
│   ├── SplashScreen.tsx
│   ├── SplashScreen.scss
│   ├── RoleSelection.tsx
│   └── RoleSelection.scss
├── App.tsx
└── App.scss
```

## Troubleshooting

### Splash screen not redirecting
- Ensure `onComplete` callback is properly set
- Check that state management is working correctly

### Role selection not working
- Verify `onRoleSelect` callback is implemented
- Check console for any TypeScript errors

### Styles not applying
- Ensure SCSS is properly compiled
- Check for CSS conflicts with global styles
- Verify all SCSS files are imported

## Performance

- Components automatically unmount when not needed
- CSS animations use GPU-accelerated transforms
- No external dependencies means minimal bundle size
- Efficient state management with TypeScript

## License

Free to use in your projects.
