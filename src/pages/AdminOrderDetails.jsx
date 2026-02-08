import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function AdminOrderDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [status, setStatus] = useState('')
    const [isPaid, setIsPaid] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/api/orders/${id}`)
                setOrder(data)
                setStatus(data.status)
                setIsPaid(data.isPaid)
            } catch (err) {
                console.error(err)
            }
        }
        fetchOrder()
    }, [id])

    const updateStatusHandler = async () => {
        try {
            await axios.put(`/api/orders/${id}/status`, { status, isPaid })
            toast.success('Order updated')
            navigate('/admin')
        } catch (err) {
            console.error(err)
            toast.error('Update failed')
        }
    }

    if (!order) return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )

    return (
        <div className="container my-5" style={{ maxWidth: '900px' }}>
            {/* UI Change: Styled Navigation Button */}
            <button
                className="btn btn-outline-secondary btn-sm mb-4 px-3"
                onClick={() => navigate('/admin')}
            >
                ← Back to Dashboard
            </button>

            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Order Details</h2>
                    <p className="text-muted mb-0">Order ID: <span className="text-dark font-monospace">{order._id}</span></p>
                </div>
                <div className="text-end">
                    <p className="text-muted mb-0">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column: Info & Items */}
                <div className="col-lg-8">
                    {/* UI Change: Modern Card for Customer & Shipping */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h5 className="card-title fw-bold mb-3">Customer Information</h5>
                            <p className="mb-1"><strong>Name:</strong> {order.user ? order.user.name : (order.shippingAddress?.name || 'N/A') + ' (Guest)'}</p>
                            <hr className="my-3 opacity-10" />
                            <h6 className="fw-bold text-uppercase small text-muted mb-2">Shipping Address</h6>
                            <p className="mb-0 text-secondary">
                                {order.shippingAddress?.address || 'No address'}<br />
                                {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.postalCode || 'N/A'}<br />
                                {order.shippingAddress?.country || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* UI Change: Alerts for Special Notes/Coupons */}
                    {order.couponCode && (
                        <div className="alert alert-primary d-flex align-items-center border-0 shadow-sm mb-4" role="alert">
                            <div className="me-2">🎟️</div>
                            <div><strong>Coupon Applied:</strong> {order.couponCode}</div>
                        </div>
                    )}

                    {order.specialNote && (
                        <div className="alert alert-warning border-0 shadow-sm mb-4" role="alert">
                            <h6 className="fw-bold">📝 Special Note:</h6>
                            <p className="mb-0 small">{order.specialNote}</p>
                        </div>
                    )}

                    {/* UI Change: Modern Table for Items */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="card-title fw-bold mb-4">Order Items</h5>
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Product</th>
                                            <th className="text-center">Qty</th>
                                            <th className="text-end">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderItems.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <div className="fw-medium">{item.name}</div>
                                                    <div className="text-muted small">Rs {item.price} each</div>
                                                </td>
                                                <td className="text-center">{item.qty}</td>
                                                <td className="text-end fw-bold">Rs {(item.qty * item.price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-between mt-4 p-3 bg-light rounded">
                                <span className="h5 mb-0">Total Amount</span>
                                <span className="h5 mb-0 fw-bold text-primary">Rs {order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status Update Actions */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm sticky-top" style={{ top: '2rem' }}>
                        <div className="card-body p-4">
                            <h5 className="card-title fw-bold mb-4">Order Actions</h5>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">ORDER STATUS</label>
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Pending">🕒 Pending</option>
                                    <option value="Processed">⚙️ Processed</option>
                                    <option value="Dispatched">🚚 Dispatched</option>
                                    <option value="Delivered">✅ Delivered</option>
                                    <option value="Canceled">❌ Canceled</option>
                                    <option value="Refunded">💰 Refunded</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">PAYMENT STATUS</label>
                                <select
                                    className="form-select"
                                    value={isPaid}
                                    onChange={(e) => setIsPaid(e.target.value === 'true')}
                                >
                                    <option value="false">🔴 Unpaid / Pending</option>
                                    <option value="true">🟢 Payment Received</option>
                                </select>
                            </div>

                            <button
                                className="btn btn-dark w-100 py-2 fw-bold shadow-sm"
                                onClick={updateStatusHandler}
                            >
                                Update Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}