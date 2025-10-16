# Gari Langu - Car Management System 🚗

A modern, mobile-first car management system built with Next.js, TypeScript, and Supabase. Track your vehicles, manage service history, and receive maintenance reminders - all with a beautiful Flutter-like mobile experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## ✨ Features

### User Features
- 🔐 **Secure Authentication** - Email/password and Google OAuth
- 🔑 **Password Reset** - ⭐ NEW! Forgot password via email
- 📧 **Email Notifications** - ⭐ NEW! Confirmation and reset emails
- 🆓 **7-Day Free Trial** - Try all features before subscribing
- 🚙 **Car Registration** - Register unlimited vehicles with photos
- 📝 **Service History** - Track all maintenance and repairs
- 🔔 **Maintenance Reminders** - Never miss a service date
- 💳 **Flexible Subscription** - Pay monthly via Tigo Pesa
- 📱 **Mobile-Optimized** - Flutter-like bottom navigation on mobile
- 🌓 **Dark Mode** - Beautiful light and dark themes
- 🌍 **Multi-language** - Support for multiple languages

### Admin Features (⭐ NEW Mobile-Optimized!)
- 👥 **User Management** - View and manage all users
- 💰 **Payment Verification** - Approve subscription payments
- 📊 **Analytics Dashboard** - ⭐ NEW! System analytics and insights
- 📢 **Notifications** - Send system-wide announcements
- 📱 **Mobile Admin Panel** - ⭐ NEW! Flutter-like mobile experience
- 🔍 **Advanced Filtering** - Search and filter users/payments
- 💡 **Quick Actions** - Fast access to common tasks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)
- npm or pnpm package manager

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd gari_langu
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

### 4. Set Up Database
1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor
3. Copy and run the SQL scripts from [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
4. Enable email authentication in Authentication settings
5. (Optional) Enable Google OAuth

### 5. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
npm run build
npm start
```

## 📱 Mobile Experience (NEW!)

Gari Langu now features a **Flutter-like mobile experience** with:
- 🔄 **Pull-to-Refresh** - Native pull-to-refresh on all list pages
- 📱 **Bottom Navigation** - iOS-style bottom tab navigation with active states
- 👆 **Touch Feedback** - Haptic-like feedback on all interactions
- 🎨 **Smooth Animations** - Material Design-inspired transitions
- 📏 **44px Touch Targets** - Apple HIG compliant touch areas
- 🍎 **iOS Safe Areas** - Full support for notch and home indicator
- ⚡ **Loading Skeletons** - Professional loading states
- 🎭 **Elevation Shadows** - Material-like depth effects
- 💨 **Smooth Scrolling** - Optimized for touch devices

See [MOBILE_FEATURES.md](./MOBILE_FEATURES.md) for complete documentation.

## 🗂️ Project Structure

```
gari_langu/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # User dashboard
│   │   ├── cars/           # Car management pages
│   │   ├── history/        # Service history
│   │   ├── reminders/      # Maintenance reminders
│   │   ├── settings/       # User settings
│   │   └── subscription/   # Subscription management
│   ├── admin/              # Admin panel
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   └── page.tsx            # Landing page
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── mobile-bottom-nav.tsx
│   ├── mobile-nav.tsx
│   ├── dashboard-nav.tsx
│   └── ...
├── lib/                     # Utilities and stores
│   ├── auth-store.ts       # Authentication state
│   ├── car-store.ts        # Car data management
│   ├── service-store.ts    # Service history
│   ├── reminder-store.ts   # Reminders
│   └── supabaseClient.ts   # Supabase client
├── public/                  # Static assets
├── DATABASE_SCHEMA.md       # Database setup guide
├── ENV_SETUP.md            # Environment setup guide
└── IMPROVEMENTS_SUMMARY.md  # Recent improvements
```

## 💻 Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- **Database**: [Supabase](https://supabase.com/) - PostgreSQL database
- **Authentication**: [Supabase Auth](https://supabase.com/auth) - Built-in auth
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Simple state management
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icons

## 📚 Documentation

### Setup & Configuration
- [Environment Setup](./ENV_SETUP.md) - How to configure environment variables
- [Database Schema](./DATABASE_SCHEMA.md) - Complete database setup guide
- [Setup Checklist](./SETUP_CHECKLIST.md) - Step-by-step setup instructions

### Features & Implementation
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - ⭐ **NEW** Complete overview of all improvements
- [Mobile Features](./MOBILE_FEATURES.md) - ⭐ **NEW** Flutter-like mobile experience guide
- [Admin Mobile Features](./ADMIN_MOBILE_FEATURES.md) - ⭐ **NEW** Admin panel mobile optimization
- [Authentication Guide](./AUTHENTICATION_GUIDE.md) - ⭐ **NEW** Complete auth & email guide
- [Email Setup](./EMAIL_SETUP.md) - ⭐ **NEW** Email notifications setup
- [Login Fix Instructions](./LOGIN_FIX_INSTRUCTIONS.md) - ⭐ **NEW** Quick fix for login issues
- [Testing Guide](./TESTING_GUIDE.md) - ⭐ **NEW** Comprehensive testing documentation
- [Improvements Summary](./IMPROVEMENTS_SUMMARY.md) - Previous changes and features

## 🎨 Features in Detail

### Car Management
- Add multiple vehicles with photos
- Store make, model, year, license plate, VIN, and more
- Edit and delete cars
- View detailed car information

### Service History
- Track all maintenance and repairs
- Record service type, date, cost, and mileage
- Add notes and garage information
- Schedule next service date

### Maintenance Reminders
- Set reminders for upcoming services
- Receive notifications via email and SMS
- Mark reminders as completed
- View upcoming and overdue reminders

### Subscription System
- 7-day free trial for new users
- Monthly subscription at 1,000 TZS
- Payment via Tigo Pesa
- Admin verification of payments
- Automatic access control

## 🔒 Security

- Row Level Security (RLS) enabled on all database tables
- User data is isolated and protected
- Secure authentication with Supabase Auth
- Environment variables for sensitive data
- HTTPS required for production

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Ibrahim Msambwe**
- Payment: Tigo Pesa +255 712 815 726

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - Amazing React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons

## 📞 Support

For support, email msambwe2@gmail.com or create an issue in the repository.

## 🗺️ Roadmap

### ✅ Recently Completed
- [x] Flutter-like mobile experience (User Dashboard)
- [x] Mobile-optimized Admin Panel ⭐ NEW!
- [x] Admin Analytics Dashboard ⭐ NEW!
- [x] Forgot Password & Reset ⭐ NEW!
- [x] Email Notifications Setup ⭐ NEW!
- [x] Improved Login Error Messages ⭐ NEW!
- [x] Auto Profile Creation ⭐ NEW!
- [x] Pull-to-refresh functionality
- [x] Touch feedback and animations
- [x] iOS safe area support
- [x] Loading skeletons
- [x] Automatic data fetching
- [x] Responsive admin navigation
- [x] Comprehensive documentation (8 guides!)

### 🔜 Coming Soon
- [ ] SMS notifications for reminders
- [ ] Email notifications for reminders
- [ ] Export service history as PDF
- [ ] Push notifications (PWA)
- [ ] Offline mode support

### 🎯 Future Plans
- [ ] Mobile app (React Native / Flutter)
- [ ] Multi-car comparison
- [ ] Garage/mechanic directory
- [ ] Parts marketplace integration
- [ ] Insurance tracking
- [ ] Fuel consumption tracking
- [ ] Trip logging

---

Made with ❤️ in Tanzania 🇹🇿

