import React, { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'
import { Link } from 'react-router-dom'
import axios, { BASE_URL } from '../api/axios'
import { toast } from 'react-toastify'

export default function CartPage() {
    const {
        cartItems,
        removeFromCart,
        updateQty,
        couponCode,
        setCouponCode,
        specialNote,
        setSpecialNote,
        discount,
        setDiscount,
        discountType,
        setDiscountType,
        appliedCoupon,
        setAppliedCoupon
    } = useContext(CartContext)

    const [loading, setLoading] = useState(false)

    const handleApplyCoupon = async () => {
        if (!couponCode) return toast.info('Please enter a coupon code')
        setLoading(true)
        try {
            const { data } = await axios.post('/api/coupons/validate', { code: couponCode })
            setDiscount(data.discountValue)
            setDiscountType(data.discountType)
            setAppliedCoupon(data.code)
            toast.success(`Coupon "${data.code}" applied!`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid coupon code')
            setDiscount(0)
            setAppliedCoupon(null)
        } finally {
            setLoading(false)
        }
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)

    let discountAmount = 0
    if (appliedCoupon) {
        discountAmount =
            discountType === 'Percentage'
                ? subtotal * (discount / 100)
                : discount
    }

    const shipping = 0
    const taxRate = 0.13
    const tax = (subtotal - discountAmount) * taxRate
    const totalAmount = subtotal - discountAmount + shipping + tax

    return (
        <div className="container my-5" style={{ maxWidth: '1100px' }}>
            {cartItems.length === 0 ? (
                <div className="text-center py-5">
                    <h2>Your cart is empty</h2>
                    <Link to="/" className="text-success">
                        Go Shopping
                    </Link>
                </div>
            ) : (
                <>
                    {/* CART TABLE */}
                    <div className="table-responsive mb-4">
                        <table className="table align-middle">
                            <thead className="border-bottom">
                                <tr className="text-capitalize">
                                    <th>Action</th>
                                    <th>Photo</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map(item => (
                                    <tr key={item._id}>
                                        <td>
                                            <button
                                                className="btn btn-link text-danger p-0"
                                                onClick={() => removeFromCart(item._id)}
                                                title="Remove Item"
                                            >
                                                <i className="bi bi-trash fs-5"></i>
                                            </button>
                                        </td>

                                        <td>
                                            <img
                                                src={
                                                    item.image?.startsWith('http')
                                                        ? item.image
                                                        : `${BASE_URL}${item.image}`
                                                }
                                                alt={item.name}
                                                className="img-fluid"
                                                style={{
                                                    width: '70px',
                                                    height: '90px',
                                                    objectFit: 'contain'
                                                }}
                                                onError={(e) => {
                                                    e.target.src =
                                                        'https://via.placeholder.com/70x90?text=No+Image'
                                                }}
                                            />
                                        </td>

                                        <td className="fw-medium w-25">
                                            {item.name}
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.qty}
                                                onChange={(e) =>
                                                    updateQty(
                                                        item._id,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="form-control"
                                                style={{ width: '70px' }}
                                            />
                                        </td>

                                        <td>Rs {item.price.toFixed(2)}</td>

                                        <td className="fw-bold">
                                            Rs {(item.price * item.qty).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="row g-4">
                        {/* LEFT: COUPON + NOTE */}
                        <div className="col-lg-6">
                            <div className="d-flex gap-2 mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Coupon Code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button
                                    className="btn btn-outline-secondary fw-bold"
                                    onClick={handleApplyCoupon}
                                    disabled={loading}
                                >
                                    {loading ? '...' : 'Apply'}
                                </button>
                            </div>

                            {appliedCoupon && (
                                <div className="text-success fw-bold small mb-3">
                                    ✓ Coupon "{appliedCoupon}" applied (
                                    {discountType === 'Percentage'
                                        ? `${discount}%`
                                        : `Rs ${discount}`}{' '}
                                    Off)
                                    <button
                                        className="btn btn-link text-danger p-0 ms-2 small"
                                        onClick={() => {
                                            setAppliedCoupon(null)
                                            setDiscount(0)
                                            setCouponCode('')
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            <label className="form-label text-muted small">
                                Special Note for this order:
                            </label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Message here"
                                value={specialNote}
                                onChange={(e) => setSpecialNote(e.target.value)}
                            />
                        </div>

                        {/* RIGHT: SUMMARY */}
                        <div className="col-lg-4 ms-lg-auto">
                            <div className="border-bottom pb-3 mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Sub Total :</span>
                                    <strong>Rs {subtotal.toFixed(2)}</strong>
                                </div>

                                {appliedCoupon && (
                                    <div className="d-flex justify-content-between mb-2 text-success">
                                        <span>Discount :</span>
                                        <strong>
                                            - Rs {discountAmount.toFixed(2)}
                                        </strong>
                                    </div>
                                )}

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping :</span>
                                    <strong>Rs {shipping.toFixed(2)}</strong>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tax (13%) :</span>
                                    <strong>Rs {tax.toFixed(2)}</strong>
                                </div>

                                <div className="d-flex justify-content-between mt-3 fs-5">
                                    <strong>Amount :</strong>
                                    <strong>Rs {totalAmount.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end">
                                <Link to="/checkout" className="btn btn-success fw-bold px-4">
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
