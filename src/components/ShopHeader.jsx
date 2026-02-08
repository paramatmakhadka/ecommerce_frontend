import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'

export default function ShopHeader() {
    const { user, logout } = useContext(AuthContext)
    const { cartItems } = useContext(CartContext)
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [keyword, setKeyword] = useState('')

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories')
                setCategories(data)
            } catch (err) {
                console.error('Failed to load categories', err)
            }
        }
        fetchCategories()
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/?keyword=${encodeURIComponent(keyword)}`)
        } else {
            navigate('/')
        }
    }

    const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0)

    return (
        <>
            {/* ===== TOP HEADER ===== */}
            <div className="bg-white border-bottom">
                <div className="container py-3 d-flex align-items-center justify-content-between">

                    {/* Logo */}
                    <Link to="/" className="fw-bold fs-4 text-decoration-none text-dark">
                        Hamro <span className="text-secondary">Pasal</span>
                    </Link>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="d-flex w-50 mx-4">
                        <input
                            className="form-control rounded-0"
                            type="search"
                            placeholder="Search products..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button className="btn btn-outline-dark rounded-0">
                            Search
                        </button>
                    </form>

                    {/* Right actions */}
                    <div className="d-flex align-items-center gap-2">
                        {!user ? (
                            <Link to="/login" className="btn btn-danger btn-sm">
                                Login
                            </Link>
                        ) : (
                            <>
                                <span className="small">Hello, {user.name}</span>

                                {user.isAdmin && (
                                    <Link to="/admin" className="btn btn-outline-secondary btn-sm">
                                        Dashboard
                                    </Link>
                                )}

                                <Link to="/profile" className="btn btn-outline-dark btn-sm">
                                    Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline-danger btn-sm"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {!user?.isAdmin && (
                            <Link to="/cart" className="btn btn-primary btn-sm position-relative">
                                <i className="bi bi-cart"></i>
                                {cartCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== CATEGORY NAVBAR ===== */}
            <nav className="navbar navbar-dark bg-dark">
                <div className="container">
                    <ul className="navbar-nav flex-row justify-content-center w-100 gap-4 overflow-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                All
                            </Link>
                        </li>

                        {categories.map((c) => (
                            <li key={c._id} className="nav-item">
                                <Link
                                    className="nav-link"
                                    to={`/category/${encodeURIComponent(c.name)}`}
                                >
                                    {c.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </>
    )
}
