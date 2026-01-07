# 🔧 Service Repair Management System (SRM) - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, responsive web application for managing mobile repair shops across Sri Lanka. Built with Next.js 14, TypeScript, and Tailwind CSS, providing role-based interfaces for Admins, Managers, Technicians, and Customers.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Key Features by Role](#-key-features-by-role)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Deployment](#-deployment)
- [API Integration](#-api-integration)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

### 🔐 Authentication & Security
- Secure JWT-based authentication
- Two-Factor Authentication (2FA) support
- Role-based access control (RBAC)
- Session management with auto-logout
- Password reset functionality

### 📊 Role-Based Dashboards
- **Admin**: System-wide analytics, shop management, user control
- **Manager**: Shop operations, staff assignments, inventory tracking
- **Technician**: Job assignments, repair updates, time tracking
- **Customer**: Repair status tracking, history, invoices

### 🔄 Real-Time Features
- Live repair status updates
- Instant notifications
- Real-time chat support (future)
- WebSocket integration ready

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Progressive Web App (PWA) ready
- Touch-friendly interfaces

### 📸 Photo Management
- Device intake photo capture
- Progress documentation
- Before/after comparisons
- Gallery view with zoom
- Cloud storage integration

### 🔔 Notification System
- In-app notifications
- Email integration
- SMS alerts (via backend)
- Push notifications (future)

---

## 🛠 Tech Stack

### Core
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components + [Lucide Icons](https://lucide.dev/)

### State Management & Data Fetching
- [TanStack Query](https://tanstack.com/query) (React Query) - Server state management
- [Zustand](https://zustand-demo.pmnd.rs/) - Client state management
- [Axios](https://axios-http.com/) - HTTP client

### Forms & Validation
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/) - Schema validation

### Utilities
- [date-fns](https://date-fns.org/) - Date manipulation
- [clsx](https://github.com/lukeed/clsx) - Conditional classNames
- [Sharp](https://sharp.pixelplumbing.com/) - Image optimization

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Git**: Latest version
- **Backend API**: SRM Backend running (see [srm-backend](https://github.com/yourusername/srm-backend))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/srm-frontend.git
cd srm-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [Environment Variables](#-environment-variables))

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Supabase Configuration (if using Supabase directly)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_TOKEN_EXPIRY=3600

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Features Flags
NEXT_PUBLIC_ENABLE_2FA=true
NEXT_PUBLIC_ENABLE_SMS=false
NEXT_PUBLIC_ENABLE_WHATSAPP=false

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Environment
NODE_ENV=development
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```
Runs on [http://localhost:3000](http://localhost:3000) with hot reload.

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

---

## 📁 Project Structure

```
srm-frontend/
├── public/                      # Static assets
│   ├── images/                  # Images and logos
│   ├── icons/                   # Icon files
│   └── favicon.ico
│
├── src/
│   ├── app/                     # Next.js 14 App Router
│   │   ├── (auth)/              # Authentication routes (grouped)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── verify-otp/
│   │   │
│   │   ├── admin/               # Admin dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── shops/
│   │   │   ├── users/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   │
│   │   ├── manager/             # Manager dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── repairs/
│   │   │   ├── customers/
│   │   │   ├── devices/
│   │   │   ├── staff/
│   │   │   └── inventory/
│   │   │
│   │   ├── technician/          # Technician dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── jobs/
│   │   │   └── assigned/
│   │   │
│   │   ├── customer/            # Customer portal routes
│   │   │   ├── dashboard/
│   │   │   ├── repairs/
│   │   │   └── history/
│   │   │
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # Reusable components
│   │   ├── admin/               # Admin-specific components
│   │   ├── manager/             # Manager-specific components
│   │   ├── technician/          # Technician-specific components
│   │   ├── customer/            # Customer-specific components
│   │   ├── shared/              # Shared components
│   │   │   ├── ui/              # UI primitives (Button, Input, etc.)
│   │   │   ├── forms/           # Form components
│   │   │   ├── tables/          # Table components
│   │   │   ├── modals/          # Modal dialogs
│   │   │   └── notifications/   # Notification components
│   │   └── layouts/             # Layout components
│   │       ├── AdminLayout.tsx
│   │       ├── ManagerLayout.tsx
│   │       ├── TechnicianLayout.tsx
│   │       └── CustomerLayout.tsx
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── api/                 # API client and endpoints
│   │   │   ├── client.ts        # Axios instance
│   │   │   ├── auth.ts          # Auth endpoints
│   │   │   ├── repairs.ts       # Repair endpoints
│   │   │   ├── customers.ts     # Customer endpoints
│   │   │   └── devices.ts       # Device endpoints
│   │   ├── auth/                # Authentication utilities
│   │   │   ├── index.ts
│   │   │   └── tokens.ts
│   │   └── utils/               # Helper functions
│   │       ├── format.ts        # Formatting utilities
│   │       ├── validation.ts    # Validation helpers
│   │       └── constants.ts     # App constants
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useRepairs.ts
│   │   ├── useCustomers.ts
│   │   ├── useNotifications.ts
│   │   └── useDebounce.ts
│   │
│   ├── store/                   # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── api.ts
│   │   └── models.ts
│   │
│   ├── constants/               # Application constants
│   │   ├── routes.ts
│   │   ├── statuses.ts
│   │   └── roles.ts
│   │
│   ├── services/                # Business logic services
│   │   ├── repairService.ts
│   │   ├── notificationService.ts
│   │   └── uploadService.ts
│   │
│   └── middleware.ts            # Next.js middleware for auth
│
├── .env.local                   # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

---

## 👥 User Roles

### 1. 🔴 Admin
- **Access Level**: Full system access
- **Permissions**: 
  - Manage all shops
  - Create/edit/delete users
  - View system-wide reports
  - Configure system settings
  - Access all data across shops

### 2. 🟠 Manager
- **Access Level**: Shop-level access
- **Permissions**:
  - Manage shop operations
  - Assign technicians to jobs
  - View shop reports
  - Manage customers and devices
  - Track inventory
  - Cannot access other shops

### 3. 🟡 Technician
- **Access Level**: Job-level access
- **Permissions**:
  - View assigned jobs
  - Update repair status
  - Upload progress photos
  - Log parts used
  - Track time spent
  - Cannot manage customers

### 4. 🟢 Customer
- **Access Level**: Personal data only
- **Permissions**:
  - Track own repair status
  - View repair history
  - Download invoices
  - Update contact information
  - View photo gallery

---

## 🎯 Key Features by Role

### Admin Dashboard
```typescript
✅ Total shops overview
✅ Revenue analytics (monthly, yearly)
✅ User management (CRUD operations)
✅ Shop performance metrics
✅ System health monitoring
✅ Audit logs and activity tracking
```

### Manager Dashboard
```typescript
✅ Active repairs overview
✅ Staff workload distribution
✅ Customer database management
✅ Device inventory tracking
✅ Parts and accessories management
✅ Invoice generation
✅ SMS/Email notifications control
```

### Technician Dashboard
```typescript
✅ Assigned jobs list (priority sorted)
✅ Job details and customer info
✅ Status update interface
✅ Photo upload (before/during/after)
✅ Parts request system
✅ Time tracking per job
```

### Customer Portal
```typescript
✅ Real-time repair status tracking
✅ Repair history with dates
✅ Photo gallery (device condition)
✅ Invoice download
✅ Feedback submission
✅ Contact information update
```

---

## 💻 Development

### Code Style

This project follows these conventions:

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb style guide
- **Prettier**: Auto-formatting on save
- **Commit Messages**: Conventional Commits

### Component Structure

```typescript
// Example: Button Component
import { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'rounded-lg font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
          'opacity-50 cursor-not-allowed': disabled || isLoading,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
```

### Custom Hooks Example

```typescript
// hooks/useRepairs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repairService } from '@/services/repairService';

export const useRepairs = (shopId?: string) => {
  const queryClient = useQueryClient();

  const { data: repairs, isLoading } = useQuery({
    queryKey: ['repairs', shopId],
    queryFn: () => repairService.getAll(shopId),
  });

  const createRepair = useMutation({
    mutationFn: repairService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
    },
  });

  return {
    repairs,
    isLoading,
    createRepair,
  };
};
```

---

## 🏗 Building for Production

### Create Production Build

```bash
npm run build
```

This will:
1. ✅ Type-check all TypeScript files
2. ✅ Run ESLint checks
3. ✅ Build optimized production bundle
4. ✅ Generate static assets
5. ✅ Create `.next` folder with production files

### Test Production Build Locally

```bash
npm run start
```

### Build Output

```
Page                              Size     First Load JS
┌ ○ /                            5.2 kB         85.3 kB
├ ○ /admin/dashboard            12.4 kB         97.5 kB
├ ○ /manager/dashboard          10.8 kB         95.9 kB
├ ○ /technician/dashboard        9.2 kB         94.3 kB
└ ○ /customer/dashboard          8.6 kB         93.7 kB

○  (Static)  automatically rendered as static HTML
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. **Connect Repository**
   ```bash
   vercel
   ```

2. **Configure Environment Variables** in Vercel Dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=.next
```

### Deploy to AWS Amplify

1. Connect your GitHub repository
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

### Deploy to DigitalOcean App Platform

1. Create new app from GitHub repo
2. Set build command: `npm run build`
3. Set run command: `npm start`
4. Add environment variables

### Self-Hosted (Docker)

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t srm-frontend .
docker run -p 3000:3000 srm-frontend
```

---

## 🔌 API Integration

### API Client Configuration

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | User login |
| `/auth/signup` | POST | User registration |
| `/auth/logout` | POST | User logout |
| `/auth/verify-otp` | POST | 2FA verification |
| `/repairs` | GET | Get all repairs |
| `/repairs/:id` | GET | Get repair by ID |
| `/repairs` | POST | Create new repair |
| `/repairs/:id` | PUT | Update repair |
| `/repairs/:id/status` | PATCH | Update status |
| `/customers` | GET | Get all customers |
| `/devices` | GET | Get all devices |
| `/photos/upload` | POST | Upload photo |

---

## 📸 Screenshots

### Login Page
![Login](docs/screenshots/login.png)

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Manager - Repair List
![Repair List](docs/screenshots/repair-list.png)

### Technician - Job Details
![Job Details](docs/screenshots/job-details.png)

### Customer Portal
![Customer Portal](docs/screenshots/customer-portal.png)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Guidelines

- Write clear, self-documenting code
- Add TypeScript types for all functions
- Write unit tests for utilities
- Update documentation for new features
- Follow existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Issues
If you encounter any problems, please [open an issue](https://github.com/yourusername/srm-frontend/issues).

### Contact
- **Email**: support@srm-system.lk
- **Website**: https://srm-system.lk
- **Developer**: Your Name ([@yourhandle](https://github.com/yourhandle))

---

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting solutions
- [Tailwind Labs](https://tailwindlabs.com/) for Tailwind CSS
- All contributors and supporters

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/yourusername/srm-frontend?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/srm-frontend?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/srm-frontend)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/yourusername/srm-frontend)

---

**Made with ❤️ for Sri Lankan Repair Shops**

---

## 🗺️ Roadmap

### Phase 1 - MVP (Month 1) ✅
- [x] User authentication
- [x] Role-based dashboards
- [x] Repair tracking
- [x] Photo management
- [x] Email notifications

### Phase 2 - Enhancements (Month 2-3)
- [ ] SMS integration
- [ ] WhatsApp notifications
- [ ] Advanced reporting
- [ ] Inventory management
- [ ] Invoice generation

### Phase 3 - Advanced Features (Month 4-6)
- [ ] Mobile app (React Native)
- [ ] AI-powered analytics
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Customer loyalty program

### Phase 4 - Scale (Month 6+)
- [ ] Multi-region deployment
- [ ] API for third-party integrations
- [ ] White-label solution
- [ ] Franchise management
- [ ] Marketplace for parts

---

**Last Updated**: January 2026
