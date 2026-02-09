import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            await login(email, password)
            navigate('/admin')
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed')
        }
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '420px' }}>
            <h3 className="mb-4 text-center">Login</h3>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={submitHandler}>
                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="loginEmail" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="loginEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="form-text">
                        We'll never share your email with anyone else.
                    </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                    <label htmlFor="loginPassword" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="loginPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Remember me (UI only) */}
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                    />
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary w-100">
                    Login
                </button>
            </form>


        </div>
    )
}
