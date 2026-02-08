import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'

export default function AdminLayout() {
    return (
        <div>
            <AdminHeader />
            <main>
                <Outlet />
            </main>
        </div>
    )
}
