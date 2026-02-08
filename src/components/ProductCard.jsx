import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../api/axios'

export default function ProductCard({ product, addToCart }) {
    const [hover, setHover] = useState(false)

    return (
        <div
            className="card h-100"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                border: '1px solid #ccc',
                boxShadow: hover
                    ? '0 10px 25px rgba(0,0,0,0.12)'
                    : '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                background: '#fff'
            }}
        >
            {/* IMAGE */}
            <Link
                to={`/product/${product._id}`}
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'block'
                }}
            >
                <img
                    src={product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`}
                    alt={product.name}
                    style={{
                        height: '220px',
                        width: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.4s ease',
                        transform: hover ? 'scale(1.1)' : 'scale(1)'
                    }}
                />

                {/* VIEW PRODUCT OVERLAY */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: hover ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }}
                >
                    <span className="btn btn-light btn-sm fw-semibold">
                        👁️ View Product
                    </span>
                </div>
            </Link>

            {/* CARD BODY */}
            <div className="card-body d-flex flex-column">
                <p className="fw-bold mb-1">Rs {product.price}</p>
                <p className="small mb-3">{product.name}</p>

                <button
                    className="btn btn-primary btn-sm mt-auto"
                    disabled={product.countInStock === 0}
                    onClick={() => addToCart(product, 1)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    )
}
