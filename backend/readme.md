# Trade Vault - Elite Mentorship & Trading App

Trade Vault is a premium mobile-first trading application featuring automated signals, an AI mentor (Jessica), and a referral-based salary system.

## 🚀 Features
- **Promoter Dashboard**: Pre-configured for `adnansheikh2165@gmail.com`.
- **Jessica AI**: Interactive chat mentor to guide users on salary milestones.
- **Salary System**: Automatically unlocks $60 daily salary for users with 3 referrals and a $250 balance.
- **Smart Trading**: Optimized signals for XAU/USD (Gold) during 7 PM and 10 PM windows.
- **PWA Ready**: Auto-hides "Install" button once added to home screen.

## 🛠️ Prerequisites
- Node.js (v18+)
- Supabase Account (for PostgreSQL database)
- Koyeb/Vercel account for hosting

## 📦 Installation & Setup

### 1. Backend Setup
    cd backend
    npm install
    # Create a .env file based on .env.example and add your Supabase DATABASE_URL
    npx prisma generate
    npx prisma db push
    npm start

### 2. Frontend Setup
    cd frontend
    npm install
    # Create a .env file and add:
    # REACT_APP_API_URL=http://localhost:5000/api
    npm start

## 🚢 Deployment Guide

### Backend (Koyeb)
1. Link your GitHub repository.
2. Set Environment Variables in Koyeb dashboard:
    - `DATABASE_URL` (From Supabase)
    - `JWT_SECRET` (A long random string)
3. Deploy. Koyeb will provide a public URL (e.g., `https://api-app.koyeb.app`).

### Frontend (Vercel)
1. Connect your GitHub repository.
2. In Vercel Environment Variables, add:
    - `REACT_APP_API_URL`: Your Koyeb backend URL + `/api`
3. Deploy. Vercel will provide your final app link (e.g., `https://trade-vault.vercel.app`).

## 🔑 Accessing the Promoter Account
- **Email**: `adnansheikh2165@gmail.com`
- **Password**: `Jessica786`
- **Role**: This account starts with a $400 balance and 2 referrals pre-loaded.

## 📈 Salary Rules
- **Condition**: Must have ≥ 3 Referrals AND ≥ $250 Account Balance.
- **Reward**: $60 one-time daily claim bonus.
- **Mentor**: Chat with Jessica to check progress.

## 🔧 Troubleshooting
- **Database Error**: Ensure the DATABASE_URL in Supabase uses the "Transaction" mode string for Prisma.
- **CORS Error**: Ensure the backend `cors` configuration allows your Vercel URL.
