import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../api/axios'
import { CartContext } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function CategoryPage() {
    const { name } = useParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { addToCart } = useContext(CartContext)

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get(`/api/products?category=${encodeURIComponent(name)}`)
                setProducts(data)
            } catch (err) {
                console.error('Failed to fetch category products', err)
            } finally {
                setLoading(false)
            }
        }
        fetchCategoryProducts()
    }, [name])

    if (loading) return <div className="container my-5 text-center"><div className="spinner-border" role="status"></div></div>

    return (
        <div className="container my-4">
            <h3 className="mb-4">Category: {name}</h3>
            {products.length === 0 ? (
                <div className="alert alert-info">No products found in this category.</div>
            ) : (
                <div className="row g-4">
                    {products.map((p) => (
                        <div key={p._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <ProductCard product={p} addToCart={addToCart} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
