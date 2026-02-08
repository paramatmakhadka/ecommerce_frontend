import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'


createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <App />
                    <ToastContainer position="top-right" autoClose={3000} />
                </React.Suspense>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
