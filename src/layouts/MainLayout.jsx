import React from 'react'
import { Outlet } from 'react-router-dom'
import ShopHeader from '../components/ShopHeader'
import Footer from '../components/Footer'

export default function MainLayout() {
    return (
        <div>
            <ShopHeader />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
