import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import AdminProductForm from './pages/AdminProductForm'
import AdminCategoryForm from './pages/AdminCategoryForm'
import AdminUserForm from './pages/AdminUserForm'
import AdminOrderDetails from './pages/AdminOrderDetails'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import CategoryPage from './pages/CategoryPage'
import { CartProvider } from './context/CartContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
    return (
        <CartProvider>
            <Routes>
                {/* Public & Shop Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path='login' element={<LoginPage />} />
                    <Route path='profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path='product/:id' element={<ProductPage />} />
                    <Route path='cart' element={<CartPage />} />
                    <Route path='checkout' element={<CheckoutPage />} />
                    <Route path='category/:name' element={<CategoryPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path='product/new' element={<AdminProductForm />} />
                    <Route path='product/:id/edit' element={<AdminProductForm />} />
                    <Route path='category/new' element={<AdminCategoryForm />} />
                    <Route path='category/:id/edit' element={<AdminCategoryForm />} />
                    <Route path='user/new' element={<AdminUserForm />} />
                    <Route path='user/:id/edit' element={<AdminUserForm />} />
                    <Route path='order/:id' element={<AdminOrderDetails />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </CartProvider>
    )
}
