# Umutulo App - Church Contribution Tracker

Umutulo is a modern, multi-tenant SaaS application designed for churches to efficiently track and manage contributions, including Tithe, Offering, and Partnership payments. It provides a mobile-first experience for both Church Administrators and Members.

## 🚀 Key Features

### 🏛️ For Church Admins

- **Church Registration**: Onboard new churches with a unique `churchId`.
- **Admin Dashboard**: Real-time overview of monthly Tithe, Offering, and Partnership totals.
- **Member Management**: Add and manage church members with optional login credentials.
- **Contribution Tracking**: Record donations easily (Tithe, Offering, Partnership) with notes and dates.
- **Transaction History**: Searchable and filterable history of all church giving.
- **SMS Reminders**: Integrated system for sending thank-you messages and monthly reminders (Integration ready).

### 👥 For Members

- **Personal Dashboard**: View your own giving history and contribution totals.
- **Giving Privacy**: Secure role-based access ensuring members only see their own data.
- **Mobile Friendly**: Access your giving profile on the go with a sleek, responsive UI.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏗️ Architecture & Security

### Multi-Tenancy

The system uses a strict multi-tenant architecture. Every document in the database is tagged with a `churchId`. Custom Firestore Security Rules ensure that:

- Admins can only access data belonging to their specific church.
- Members can only view their own personal transactions within their church.
- Data isolation is enforced at the database level.

### Folder Structure

```text
src/
├── app/
│   ├── (auth)/        # Registration & Login
│   ├── admin/         # Admin dashboards & management
│   ├── member/        # Member profile & history
│   └── page.js        # Marketing landing page
├── context/
│   └── AuthContext.js # Global Auth & Multi-tenant state
└── lib/
    └── firebase.js    # Firebase initialization
```

## ⚙️ Getting Started

### 1. Prerequisite

- Node.js installed.
- A Firebase project.

### 2. Installation

```bash
git clone https://github.com/maloba12/umutulo.git
cd umutulo
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Firebase credentials (see `.env.local.example`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Rules

Deploy the following rules to your Firebase Console to ensure data security:

- Copy the contents of `firestore.rules` and paste them into the "Rules" tab of your Firestore Database.

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📄 License

This project is for demonstration and SaaS development purposes. All rights reserved.
