<div align="center">

# 🎮 Key Trap - MINDTYPE Neon Rift

### *A Premium Memory & Typing Challenge Game*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.9.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Live Demo](https://key-trap.web.app) • [Report Bug](https://github.com/mdjameee400/key-trap/issues) • [Request Feature](https://github.com/mdjameee400/key-trap/issues)

</div>

---

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Game Mechanics](#game-mechanics)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About The Project

**Key Trap** is a cutting-edge web-based memory and typing challenge game that combines cognitive skills with typing speed. Immerse yourself in a stunning neon-space aesthetic while testing your memory retention and typing accuracy through progressively challenging levels.

The game features a unique two-phase gameplay system:
1. **Memory Phase**: Players memorize answers to questions within a time-limited window
2. **Typing Phase**: Players type the memorized answers as quickly and accurately as possible

Built with modern web technologies and designed with a premium user experience in mind, Key Trap offers smooth animations, glassmorphism effects, and a tri-state neon color system (Emerald, Amber, Crimson) that creates an immersive deep-space nebula atmosphere.

---

## ✨ Key Features

### 🎮 **Gameplay**
- **Dual-Phase Challenge**: Memory retention followed by speed typing
- **Multiple Difficulty Modes**: Easy, Medium, and Hard levels
- **Dynamic Scoring System**: Points based on speed, accuracy, and difficulty
- **Real-time Performance Tracking**: WPM, accuracy, and streak statistics
- **Progressive Difficulty**: Questions become more challenging as you advance

### 🎨 **Design & UX**
- **Premium Neon-Space Theme**: Deep space nebula background with animated stars
- **Glassmorphism UI**: Modern frosted-glass effect components
- **Smooth Animations**: Powered by Framer Motion for fluid transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG-compliant color contrasts and keyboard navigation

### 🔐 **Authentication & Security**
- **Firebase Authentication**: Secure user management
- **Multiple Sign-in Methods**: Email/Password and Google OAuth
- **Protected Routes**: Authenticated access to game features
- **Secure Environment Variables**: API keys protected via `.env` files

### 📊 **User Features**
- **Personal Statistics Dashboard**: Track your progress over time
- **Achievement System**: Unlock badges and milestones
- **Leaderboard**: Compete with players globally
- **Profile Customization**: Personalize your gaming experience

---

## 🛠️ Tech Stack

### **Frontend**
- **[React 18.3.1](https://reactjs.org/)** - Modern UI library with hooks and context
- **[React Router DOM 6.30.1](https://reactrouter.com/)** - Client-side routing
- **[Vite 5.4.19](https://vitejs.dev/)** - Lightning-fast build tool and dev server
- **[Tailwind CSS 3.4.17](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion 12.34.0](https://www.framer.com/motion/)** - Production-ready animation library

### **Backend & Services**
- **[Firebase 12.9.0](https://firebase.google.com/)** - Backend-as-a-Service
  - Authentication (Email/Password, Google OAuth)
  - Firestore Database (NoSQL)
  - Hosting & Deployment

### **UI Components & Libraries**
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization

### **Development Tools**
- **[ESLint](https://eslint.org/)** - Code linting and quality
- **[PostCSS](https://postcss.org/)** - CSS transformations
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - Vendor prefix automation

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher)
  ```bash
  node --version  # Should output v18.0.0 or higher
  ```

- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
  ```bash
  npm --version   # Should output v9.0.0 or higher
  ```

- **Git** (v2.30.0 or higher)
  ```bash
  git --version   # Should output v2.30.0 or higher
  ```

- **Firebase Account** - [Create one here](https://firebase.google.com/) if you don't have one

---

### Installation

#### 1. **Clone the Repository**

```bash
# Clone via HTTPS
git clone https://github.com/mdjameee400/key-trap.git

# Or clone via SSH
git clone git@github.com:mdjameee400/key-trap.git

# Navigate to the project directory
cd key-trap
```

#### 2. **Install Dependencies**

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

This will install all required dependencies listed in `package.json`, including:
- React and React DOM
- Firebase SDK
- Tailwind CSS and plugins
- Framer Motion
- And all other project dependencies

#### 3. **Verify Installation**

```bash
# Check if node_modules directory was created
ls node_modules

# Verify key packages are installed
npm list react firebase vite
```

---

### Environment Configuration

#### 1. **Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the setup wizard
3. Enable **Authentication** (Email/Password and Google providers)
4. Create a **Firestore Database** (start in production mode)
5. Register your web app to get configuration credentials

#### 2. **Set Up Environment Variables**

Create a `.env` file in the project root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file and add your Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **⚠️ IMPORTANT SECURITY NOTES:**
> - **NEVER** commit the `.env` file to version control
> - The `.env` file is already listed in `.gitignore`
> - Use `.env.example` as a template for other developers
> - Keep your Firebase API keys secure and rotate them if exposed

#### 3. **Verify Environment Setup**

```bash
# Check if .env file exists and is properly formatted
cat .env

# Ensure .env is in .gitignore
cat .gitignore | grep .env
```

---

### Running the Application

#### **Development Mode**

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at:
- **Local**: `http://localhost:5173`
- **Network**: `http://<your-ip>:5173` (for testing on other devices)

#### **Production Build**

Build the application for production:

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

#### **Preview Production Build**

Preview the production build locally:

```bash
npm run preview
```

#### **Linting**

Run ESLint to check code quality:

```bash
npm run lint
```

---

## 📁 Project Structure

```
key-trap/
├── public/                      # Static assets
│   ├── icon.png                # App icon
│   └── ...
├── src/                        # Source files
│   ├── components/             # React components
│   │   └── game/              # Game-specific components
│   │       ├── HeroScreen.jsx # Landing/menu screen
│   │       ├── MemoryPhase.jsx # Memory challenge phase
│   │       ├── TypingPhase.jsx # Typing challenge phase
│   │       ├── TypingTest.jsx  # Main game controller
│   │       ├── ResultScreen.jsx # Score display
│   │       ├── ModeSelect.jsx  # Difficulty selection
│   │       └── StarField.jsx   # Animated background
│   ├── context/               # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state
│   │   └── GameContext.jsx    # Game state management
│   ├── lib/                   # Utility libraries
│   │   ├── firebase.js        # Firebase configuration
│   │   ├── gameData.js        # Question database
│   │   └── utils.js           # Helper functions
│   ├── pages/                 # Page components
│   │   ├── Index.jsx          # Home page
│   │   ├── Auth.jsx           # Authentication page
│   │   └── NotFound.jsx       # 404 page
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── .env                       # Environment variables (not in repo)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── firebase.json              # Firebase hosting config
├── .firebaserc                # Firebase project config
├── index.html                 # HTML entry point
├── package.json               # Project dependencies
├── tailwind.config.js         # Tailwind configuration
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

---

## 🎮 Game Mechanics

### **Phase 1: Memory Challenge**

1. **Question Display**: Players are shown a set of questions with their answers
2. **Memorization Time**: A countdown timer gives players time to memorize
3. **Visual Cues**: Questions are color-coded by difficulty
4. **Preparation**: Players mentally prepare for the typing phase

### **Phase 2: Typing Challenge**

1. **Question Recall**: Questions appear one at a time (without answers)
2. **Speed Typing**: Players type the memorized answers
3. **Real-time Validation**: Instant feedback on accuracy
4. **Performance Metrics**: WPM, accuracy, and time tracking

### **Scoring System**

```javascript
Base Score = Correct Answers × Difficulty Multiplier
Time Bonus = Remaining Time × 10
Accuracy Bonus = (Accuracy % / 100) × 50
Streak Bonus = Consecutive Correct × 5

Total Score = Base Score + Time Bonus + Accuracy Bonus + Streak Bonus
```

### **Difficulty Levels**

| Level  | Questions | Memory Time | Typing Time | Multiplier |
|--------|-----------|-------------|-------------|------------|
| Easy   | 5         | 30s         | 60s         | 1x         |
| Medium | 8         | 45s         | 90s         | 1.5x       |
| Hard   | 12        | 60s         | 120s        | 2x         |

---

## 🌐 Deployment

### **Firebase Hosting**

The project is configured for Firebase Hosting deployment.

#### **Initial Setup**

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init
```

#### **Deploy to Production**

```bash
# Build the production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy

# Or deploy only hosting
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

### **Custom Domain** (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration instructions
4. Wait for SSL certificate provisioning (24-48 hours)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### **How to Contribute**

1. **Fork the Project**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/key-trap.git
   cd key-trap
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: Amazing new feature"
   ```
   
   **Commit Message Convention:**
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes
   - `Style:` for formatting changes
   - `Test:` for adding tests

6. **Push to Your Fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Provide a clear description of your changes
   - Reference any related issues

### **Development Guidelines**

- **Code Quality**: Ensure your code passes ESLint checks (`npm run lint`)
- **Testing**: Test your changes thoroughly before submitting
- **Documentation**: Update README.md if you add new features
- **Responsive Design**: Ensure UI changes work on all screen sizes
- **Performance**: Optimize for fast load times and smooth animations
- **Accessibility**: Follow WCAG 2.1 guidelines for accessibility
- **Security**: Never commit sensitive data or API keys

### **Reporting Bugs**

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information

### **Feature Requests**

We welcome feature suggestions! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach (optional)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**MD JAMEE** - [@mdjameee400](https://github.com/mdjameee400) - mdjameee400@gmail.com

**Project Link**: [https://github.com/mdjameee400/key-trap](https://github.com/mdjameee400/key-trap)

**Live Demo**: [https://key-trap.web.app](https://key-trap.web.app)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/) - Comprehensive React guides
- [Firebase Documentation](https://firebase.google.com/docs) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ by [MD JAMEE](https://github.com/mdjameee400)

</div>
