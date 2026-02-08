import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function AdminHeader() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <>
            {/* ===== ADMIN TOP BAR ===== */}
            <div className="navbar navbar-dark bg-dark border-bottom">
                <div className="container py-3 d-flex align-items-center justify-content-between">

                    {/* Logo / Title */}
                    <Link
                        to="/admin"
                        className="text-dark text-decoration-none fw-bold fs-5 text-white"
                    >
                        Hamro <span className="text-secondary">Pasal</span>
                    </Link>

                    {/* Navigation */}
                    <div className="d-flex align-items-center gap-3">

                        <Link to="/" className="btn btn-outline-secondary btn-sm text-white">
                            View Store
                        </Link>

                        <Link to="/admin" className="btn btn-outline-dark btn-sm text-white">
                            Dashboard
                        </Link>

                        <Link to="/admin?tab=products" className="btn btn-outline-dark btn-sm text-white">
                            Products
                        </Link>

                        <Link to="/admin?tab=users" className="btn btn-outline-dark btn-sm text-white">
                            Users
                        </Link>

                        <Link to="/admin?tab=orders" className="btn btn-outline-dark btn-sm text-white">
                            Orders
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="btn btn-danger btn-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== ADMIN SUB BAR (OPTIONAL) ===== */}
            <nav className="navbar navbar-dark bg-dark">
                <div className="container">
                    <span className="navbar-text small text-light">
                        Logged in as: <strong>{user?.name}</strong>
                    </span>
                </div>
            </nav>
        </>
    )
}
