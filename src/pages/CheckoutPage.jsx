import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function CheckoutPage() {
    const { cartItems, clearCart, couponCode, specialNote, discount, discountType, appliedCoupon } = useContext(CartContext)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', address: '', city: '', postalCode: '', country: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)

    let discountAmount = 0
    if (appliedCoupon) {
        if (discountType === 'Percentage') {
            discountAmount = subtotal * (discount / 100)
        } else {
            discountAmount = discount
        }
    }

    const shipping = 0
    const taxRate = 0.13
    const tax = (subtotal - discountAmount) * taxRate
    const finalTotal = subtotal - discountAmount + shipping + tax

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item._id
                })),
                shippingAddress: form,
                paymentMethod: 'Cash on Delivery',
                totalPrice: finalTotal,
                couponCode,
                specialNote
            }

            const { data } = await axios.post('/api/orders', orderData)

            toast.success('Order placed successfully (Cash on Delivery)')
            clearCart()
            navigate('/')
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || 'Order placement failed')
        } finally {
            setLoading(false)
        }
    }

    if (cartItems.length === 0) {
        return <div style={{ padding: 20, textAlign: 'center' }}>Your cart is empty.</div>
    }

    return (
        <div style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
            <h2>Checkout</h2>
            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee' }}>
                <h3>Order Summary</h3>
                <p><strong>Total Items:</strong> {cartItems.reduce((acc, item) => acc + item.qty, 0)}</p>
                <p><strong>Subtotal:</strong> Rs {subtotal.toFixed(2)}</p>
                {appliedCoupon && (
                    <p style={{ color: '#1b7e52' }}><strong>Discount:</strong> - Rs {discountAmount.toFixed(2)}</p>
                )}
                <p><strong>Tax (13%):</strong> Rs {tax.toFixed(2)}</p>
                <p><strong>Final Price:</strong> Rs {finalTotal.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
            </div>

            <form onSubmit={submitHandler}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block' }}>Full Name</label>
                    <input name='name' value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block' }}>Address</label>
                    <input name='address' value={form.address} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block' }}>City</label>
                        <input name='city' value={form.city} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block' }}>Postal Code</label>
                        <input name='postalCode' value={form.postalCode} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block' }}>Country</label>
                    <input name='country' value={form.country} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <button type='submit' disabled={loading || cartItems.length === 0} style={{ width: '100%', padding: '1rem', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>
                        {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
                    </button>
                </div>
            </form>
        </div>
    )
}
