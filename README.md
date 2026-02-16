# Key Trap - Memory & Typing Challenge

A premium web-based memory and typing game.

## Project Features
- **Memory Phase**: Memorize specific answers to questions within a time limit.
- **Typing Phase**: Type the memorized answers as fast as you can.
- **Scoring System**: Dynamic scoring based on speed, accuracy, and difficulty.
- **Authentication**: Firebase integration with Email/Password and Google Sign-in.
- **Aesthetic Design**: Neon-space theme with smooth animations.

## Tech Stack
- **Frontend**: React (JavaScript/JSX)
- **Styling**: Tailwind CSS & Framer Motion
- **Database/Auth**: Firebase
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root and add your Firebase configurations:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
