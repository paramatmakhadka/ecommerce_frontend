import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import axios from '../api/axios'
import { CartContext } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
    const [products, setProducts] = useState([])
    const { addToCart } = useContext(CartContext)
    const { search } = useLocation()
    const keyword = new URLSearchParams(search).get('keyword') || ''

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = keyword
                    ? `/api/products?keyword=${encodeURIComponent(keyword)}`
                    : '/api/products'
                const { data } = await axios.get(url)
                setProducts(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchProducts()
    }, [keyword])

    return (
        <div className="container my-4">
            <h3 className="mb-4">
                {keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
            </h3>

            <div className="row g-4">
                {products.map((p) => (
                    <div key={p._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <ProductCard product={p} addToCart={addToCart} />
                    </div>
                ))}
            </div>
        </div>
    )
}
