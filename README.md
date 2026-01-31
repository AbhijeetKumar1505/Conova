# Conova - Premium Community Platform

A premium, connection-focused community platform designed to help people build meaningful digital relationships in a modern, distraction-free environment.

## 🚀 Tech Stack

- **Frontend**: React Native (Expo) with TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Cross-Platform**: iOS, Android, and Web support

## 📋 Features

- **Authentication**: Secure signup/login with session management
- **Profiles**: Personalized user profiles with avatars and bios
- **Content Sharing**: Create and share meaningful posts with images
- **Circles**: Small group communities for focused discussions
- **Real-Time**: Live updates for posts, comments, and reactions
- **Notifications**: Activity alerts for engagement and interactions

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Conova
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your Supabase credentials:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

4. Start the development server
```bash
npm start
```

### Run on Different Platforms

```bash
# iOS (requires macOS)
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/         # Main app screens
├── modules/         # Feature modules
│   ├── auth/       # Authentication
│   ├── profile/    # User profiles
│   ├── feed/       # Content feed
│   ├── circles/    # Communities
│   └── notifications/ # Notifications
├── services/        # API and Supabase services
├── utils/          # Helper functions
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── assets/         # Images, fonts, icons
└── config/         # App configuration
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📚 Documentation

- [Project Overview](docs/project_overview_connected_premium_community_app.md)
- [System Design](docs/system_design_connected_premium_community_app.md)
- [Workflow Design](docs/workflow_design_connected_premium_community_app.md)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🎨 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Please contact the project owner for contribution guidelines.

---

Built with ❤️ using React Native and Supabase
