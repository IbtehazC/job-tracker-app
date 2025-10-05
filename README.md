# Job Tracker App - Frontend (Mock Data Version)

A collaborative job application tracker that gamifies the job search process. This is the **frontend-only version** using mock data and localStorage.

## 🚀 Features

### ✅ Implemented (Frontend with Mock Data)

- **Authentication System**
  - Email/Password signup and login
  - Google Sign-In simulation
  - Protected routes
  - Persistent sessions (localStorage)

- **Dashboard**
  - Personal stats (total applications, rank, progress)
  - Current challenge progress
  - Recent applications preview
  - Quick add application form

- **Feed Page**
  - View all applications from all users
  - Real-time updates (simulated)
  - Application cards with user info
  - Delete your own applications

- **Leaderboard**
  - Ranked users by application count
  - Progress bars showing challenge completion
  - Current user highlighting
  - Trophy icons for top 3

- **Challenge System**
  - "Apply to 100 Jobs" challenge
  - Progress tracking
  - Countdown timer to next Monday
  - Completion celebration

- **Application Management**
  - Add new applications (job title, company, URL)
  - Form validation
  - View all applications
  - Delete applications
  - Application count tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Data Storage**: LocalStorage (mock data)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm

### Installation

1. Navigate to the project directory:
   ```bash
   cd job-tracker-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 How to Use

### First Time Setup

1. **Sign Up**: Click "Sign up" and create an account with any email/password
   - Or use the "Sign in with Google" button (simulates login with mock user)

2. **Explore the App**:
   - **Dashboard**: View your stats and add applications
   - **Feed**: See all applications from all users
   - **Leaderboard**: Check your ranking

### Adding Applications

1. Go to Dashboard
2. Fill out the form with:
   - Job Title (e.g., "Senior Software Engineer")
   - Company (e.g., "Google")
   - Job URL (must be a valid URL)
3. Click "Add Application"

### Mock Users

The app comes with 4 pre-loaded mock users with existing applications:
- Sarah Smith (@sarah_smith) - 89 applications
- Mike Wilson (@mike_wilson) - 67 applications
- John Doe (@john_doe) - 47 applications
- Emily Brown (@emily_brown) - 34 applications

You can sign in with Google to use one of these mock accounts.

## 📂 Project Structure

```
job-tracker-app/
├── app/
│   ├── dashboard/          # Dashboard page
│   ├── feed/               # Feed page
│   ├── leaderboard/        # Leaderboard page
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── layout.tsx          # Root layout with AuthProvider
│   └── page.tsx            # Home page (redirects)
├── components/
│   ├── application/        # Application-related components
│   ├── auth/               # Authentication forms
│   ├── challenge/          # Challenge components
│   ├── leaderboard/        # Leaderboard components
│   ├── layout/             # Layout components (Header, etc.)
│   └── ui/                 # Reusable UI components
├── contexts/
│   └── AuthContext.tsx     # Auth context provider
├── lib/
│   ├── hooks/              # Custom React hooks
│   ├── mock/               # Mock data and storage utilities
│   └── utils/              # Utility functions
└── types/
    └── *.ts                # TypeScript type definitions
```

## 🎨 Design Decisions

### Mock Data Approach

- **LocalStorage**: All data persists in browser localStorage
- **Mock Users**: 4 pre-loaded users with applications
- **Mock Challenge**: "Apply to 100 Jobs" challenge ending next Monday
- **Simulated Real-time**: Updates happen instantly via state management

### Why Mock Data First?

1. **Rapid Prototyping**: Build and test UI/UX without backend complexity
2. **Easy Testing**: No need for Firebase setup or authentication
3. **Isolated Development**: Frontend team can work independently
4. **Clean Migration**: Mock layer can be swapped for real Firebase later

## 🔄 Next Steps (Backend Integration)

When ready to integrate Firebase:

1. Replace `lib/mock/storage.ts` with Firebase Firestore calls
2. Replace mock auth in `contexts/AuthContext.tsx` with Firebase Auth
3. Update hooks to use Firestore real-time listeners
4. Add Firebase security rules
5. Deploy to Vercel

The component structure and UI are already production-ready!

## 🧪 Testing

### Manual Testing Checklist

- [x] Sign up with email/password
- [x] Sign in with email/password
- [x] Sign in with Google (mock)
- [x] Sign out
- [x] Add application
- [x] View applications in feed
- [x] Delete own application
- [x] View leaderboard rankings
- [x] Challenge progress updates
- [x] Countdown timer works
- [x] Responsive design (mobile/tablet/desktop)
- [x] Protected routes redirect to login

## 📝 Known Limitations (Mock Version)

- Data only persists in browser localStorage (cleared when cache is cleared)
- No real-time sync between different browser tabs/windows
- No actual Firebase authentication
- Password validation is minimal (just length check)
- Challenge deadline is calculated client-side
- No data persistence across devices

## 🎯 Features Ready for Backend

All UI components are built and ready to connect to Firebase:

- User authentication flows
- CRUD operations for applications
- Leaderboard ranking system
- Challenge tracking
- Real-time updates infrastructure
- Form validation
- Error handling
- Loading states

## 🤝 Contributing

This is a prototype frontend. When integrating with Firebase:

1. Keep component structure intact
2. Replace mock storage with Firebase calls
3. Add proper error handling for network issues
4. Implement Firebase security rules
5. Add environment variables for Firebase config

## 📄 License

This project is for demonstration purposes.

---

**Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS**

🚀 **Ready for backend integration with Firebase!**
