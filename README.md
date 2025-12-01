# Smart To-Do App

A modern, feature-rich task management application built with React, Tailwind CSS, and Firebase. This application helps users organize their tasks efficiently with features like categorization, priorities, and cloud synchronization.

## 🚀 Features

- **Authentication**: Secure user sign-up and login using Firebase Authentication.
- **Task Management**: Create, read, update, and delete tasks effortlessly.
- **Categories & Priorities**: Organize tasks by custom categories and set priority levels (Low, Medium, High).
- **Smart Sorting**: Automatically sort tasks by due date, priority, or status.
- **Dark/Light Mode**: Toggle between dark and light themes for a comfortable viewing experience.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **Cloud Sync**: Real-time data synchronization with Firebase Firestore.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/) (v19), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/) (v7)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Backend/BaaS**: [Firebase](https://firebase.google.com/) (Auth, Firestore)

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd smart-todo-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    -   Create a project in the [Firebase Console](https://console.firebase.google.com/).
    -   Enable **Authentication** (Email/Password).
    -   Enable **Firestore Database**.
    -   Create a `.env` file in the root directory and add your Firebase configuration keys:
        ```env
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components
├── context/      # React Context for global state (Auth, Theme)
├── hooks/        # Custom React hooks
├── lib/          # Utility functions and Firebase configuration
├── pages/        # Application pages (Dashboard, Login, etc.)
├── assets/       # Static assets (images, icons)
├── App.jsx       # Main application component
└── main.jsx      # Entry point
```

## 📄 License

This project is licensed under the MIT License.
