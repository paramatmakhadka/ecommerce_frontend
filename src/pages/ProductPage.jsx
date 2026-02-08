import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from '../api/axios'
import { CartContext } from '../context/CartContext'

export default function ProductPage() {
    const { id } = useParams()
    const { addToCart } = useContext(CartContext)

    const [product, setProduct] = useState(null)
    const [related, setRelated] = useState([])
    const [qty, setQty] = useState(1)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const fetchProductAndRelated = async () => {
            try {
                setLoading(true)

                // 1️⃣ Fetch single product
                const { data } = await axios.get(
                    `/api/products/${id}`
                )
                setProduct(data)
                setQty(1)

                // 2️⃣ Fetch related products by category
                const res = await axios.get(
                    `/api/products?category=${encodeURIComponent(
                        data.category
                    )}`
                )

                setRelated(
                    res.data.filter((p) => p._id !== data._id)
                )

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchProductAndRelated()
    }, [id])

    if (loading || !product) {
        return <div className="container my-5">Loading...</div>
    }

    return (
        <div className="container my-5">
            <div className="row g-4">

                {/* ===== MAIN PRODUCT ===== */}
                <div className="col-lg-8">
                    <div
                        style={{
                            border: '1px solid #e5e5e5',
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                            padding: '2rem',
                            background: '#fff'
                        }}
                    >
                        <h4 className="text-center mb-4">{product.name}</h4>

                        <div
                            className="text-center mb-4"
                            onClick={() => setShowModal(true)}
                            style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '8px' }}
                        >
                            <img
                                src={`http://localhost:5000${product.image}`}
                                alt={product.name}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '420px',
                                    objectFit: 'contain',
                                    transition: 'transform 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                            <p className="text-muted small mt-2"><i className="bi bi-zoom-in"></i> Click to enlarge</p>
                        </div>

                        <p className="fw-bold fs-5">Rs. {product.price}</p>

                        <p className="text-muted">{product.description}</p>

                        <div className="d-flex align-items-center gap-3 mb-3">
                            <label className="fw-semibold">Qty</label>
                            <input
                                type="number"
                                min={1}
                                max={product.countInStock}
                                value={qty}
                                onChange={(e) =>
                                    setQty(
                                        Math.max(
                                            1,
                                            Math.min(product.countInStock, Number(e.target.value))
                                        )
                                    )
                                }
                                className="form-control"
                                style={{ width: '90px' }}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            disabled={product.countInStock === 0}
                            onClick={() => addToCart(product, qty)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* ===== RELATED PRODUCTS ===== */}
                <div className="col-lg-4">
                    <h5 className="mb-3">Related Products</h5>

                    {related.length === 0 && (
                        <p className="text-muted small">No related products</p>
                    )}

                    <div className="d-flex flex-column gap-3">
                        {related.slice(0, 4).map((p) => (
                            <Link
                                key={p._id}
                                to={`/product/${p._id}`}
                                className="text-decoration-none text-dark"
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        padding: '0.75rem',
                                        background: '#fff',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                >
                                    <img
                                        src={`http://localhost:5000${p.image}`}
                                        alt={p.name}
                                        style={{
                                            width: '70px',
                                            height: '70px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                    <div>
                                        <p className="small fw-semibold mb-1">{p.name}</p>
                                        <p className="small text-muted mb-0">
                                            Rs. {p.price}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

            {/* ===== IMAGE MODAL ===== */}
            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        cursor: 'zoom-out',
                        padding: '20px',
                        animation: 'fadeIn 0.3s ease'
                    }}
                >
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                    <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                            backgroundColor: '#fff'
                        }}
                    />
                    <button
                        onClick={() => setShowModal(false)}
                        className="btn-close btn-close-white"
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '1.5rem'
                        }}
                    ></button>
                </div>
            )}
        </div>
    )
}
