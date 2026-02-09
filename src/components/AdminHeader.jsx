import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function AdminHeader() {
    const { user } = useContext(AuthContext)

    return (
        <div className="navbar navbar-dark bg-dark border-bottom">
            <div className="container-fluid px-3">
                <Link
                    to="/admin"
                    className="navbar-brand text-decoration-none fw-bold fs-5 m-0"
                >
                    Hamro <span className="text-secondary">Pasal</span>
                </Link>
                <div className="d-flex align-items-center gap-3">
                    <span className="text-white small d-none d-md-inline">{user?.name}</span>
                    <Link to="/" className="btn btn-outline-secondary btn-sm text-white">
                        View Store
                    </Link>
                </div>
            </div>
        </div>
    )
}
