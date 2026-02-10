import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios, { BASE_URL } from '../api/axios'
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

                const { data } = await axios.get(`/api/products/${id}`)
                setProduct(data)
                setQty(1)

                const res = await axios.get(
                    `/api/products?category=${encodeURIComponent(data.category)}`
                )

                setRelated(res.data.filter(p => p._id !== data._id))
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

                {/* MAIN PRODUCT */}
                <div className="col-lg-8">
                    <div className="card shadow-lg border rounded-4 p-4">
                        <h4 className="text-center mb-4">{product.name}</h4>

                        <div
                            className="text-center mb-4 overflow-hidden rounded"
                            role="button"
                            onClick={() => setShowModal(true)}
                        >
                            <img
                                src={
                                    product.image?.startsWith('http')
                                        ? product.image
                                        : `${BASE_URL}${product.image}`
                                }
                                alt={product.name}
                                className="img-fluid"
                                style={{ maxHeight: '420px', objectFit: 'contain' }}
                            />
                            <p className="text-muted small mt-2">
                                <i className="bi bi-zoom-in"></i> Click to enlarge
                            </p>
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
                                            Math.min(
                                                product.countInStock,
                                                Number(e.target.value)
                                            )
                                        )
                                    )
                                }
                                className="form-control w-auto"
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

                {/* RELATED PRODUCTS */}
                <div className="col-lg-4">
                    <h5 className="mb-3">Related Products</h5>

                    {related.length === 0 && (
                        <p className="text-muted small">No related products</p>
                    )}

                    <div className="d-flex flex-column gap-3">
                        {related.slice(0, 4).map(p => (
                            <Link
                                key={p._id}
                                to={`/product/${p._id}`}
                                className="text-decoration-none text-dark"
                            >
                                <div className="card shadow-sm border rounded-3 p-2">
                                    <div className="d-flex gap-3 align-items-center">
                                        <img
                                            src={
                                                p.image?.startsWith('http')
                                                    ? p.image
                                                    : `${BASE_URL}${p.image}`
                                            }
                                            alt={p.name}
                                            className="img-fluid"
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                objectFit: 'contain'
                                            }}
                                        />
                                        <div>
                                            <p className="small fw-semibold mb-1">
                                                {p.name}
                                            </p>
                                            <p className="small text-muted mb-0">
                                                Rs. {p.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* IMAGE MODAL */}
            {showModal && (
                <div
                    className="modal fade show d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
                    onClick={() => setShowModal(false)}
                >
                    <div className="position-relative">
                        <img
                            src={
                                product.image?.startsWith('http')
                                    ? product.image
                                    : `${BASE_URL}${product.image}`
                            }
                            alt={product.name}
                            className="img-fluid rounded shadow bg-white"
                            style={{ maxHeight: '90vh', maxWidth: '90vw' }}
                        />
                        <button
                            className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                            onClick={() => setShowModal(false)}
                        ></button>
                    </div>
                </div>
            )}
        </div>
    )
}
