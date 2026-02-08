import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function ProfilePage() {
    const { user, loading } = useContext(AuthContext)

    if (loading) return <div style={{ padding: 20 }}>Loading...</div>

    return (
        <div style={{ maxWidth: 800, margin: '2rem auto' }}>
            <h2>Profile</h2>
            {user ? (
                <div>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            ) : (
                <p>Not logged in.</p>
            )}
        </div>
    )
}
