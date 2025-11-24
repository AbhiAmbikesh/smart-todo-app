import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { CategoryProvider } from './context/CategoryContext.jsx'
import { TaskProvider } from './context/TaskContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <CategoryProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </CategoryProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>,
)
