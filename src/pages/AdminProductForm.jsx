import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { BASE_URL } from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function AdminProductForm() {
    const { id } = useParams()
    const isNew = !id || id === 'new'
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [uploading, setUploading] = useState(false)

    const [form, setForm] = useState({
        name: '',
        price: 0,
        image: '',
        brand: '',
        category: '',
        countInStock: 0,
        description: '',
    })

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await axios.get('/api/categories')
            setCategories(data)
        }
        fetchCategories()

        if (!isNew) {
            const fetchProduct = async () => {
                try {
                    const { data } = await axios.get(`/api/products/${id}`)
                    setForm({
                        name: data.name || '',
                        price: data.price || 0,
                        image: data.image || '',
                        brand: data.brand || '',
                        category: data.category || '',
                        countInStock: data.countInStock || 0,
                        description: data.description || '',
                    })
                } catch (err) {
                    console.error(err)
                }
            }
            fetchProduct()
        }
    }, [id, isNew])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('image', file)
            const { data } = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setForm({ ...form, image: data.filePath })
            toast.success('Image uploaded')
        } catch (err) {
            console.error(err)
            toast.error('Image upload failed')
        } finally {
            setUploading(false)
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            if (isNew) {
                await axios.post('/api/products', form)
                toast.success('Product created')
            } else {
                await axios.put(`/api/products/${id}`, form)
                toast.success('Product updated')
            }
            navigate('/admin')
        } catch (err) {
            console.error(err)
            toast.error('Save failed')
        }
    }

    return (
        <div className="container my-5" style={{ maxWidth: '850px' }}>
            {/* UI Change: Header and Navigation */}
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-link text-decoration-none p-0 me-3" onClick={() => navigate('/admin')}>
                    <span className="h3">←</span>
                </button>
                <h2 className="h3 mb-0 fw-bold">{isNew ? 'Create New Product' : 'Edit Product'}</h2>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                    <form onSubmit={submitHandler}>
                        <div className="row g-4">

                            {/* Product Name */}
                            <div className="col-12">
                                <label className="form-label fw-semibold text-muted small">PRODUCT NAME</label>
                                <input
                                    className="form-control form-control-lg"
                                    placeholder="Enter product name"
                                    name='name'
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Price and Stock */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-muted small">PRICE (RS)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">Rs</span>
                                    <input
                                        className="form-control border-start-0 ps-0"
                                        name='price'
                                        type='number'
                                        value={form.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-muted small">COUNT IN STOCK</label>
                                <input
                                    className="form-control"
                                    name='countInStock'
                                    type='number'
                                    value={form.countInStock}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Brand and Category */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-muted small">BRAND</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. L'Oreal"
                                    name='brand'
                                    value={form.brand}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-muted small">CATEGORY</label>
                                <select
                                    className="form-select"
                                    name='category'
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value=''>Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Image Upload Area */}
                            <div className="col-12">
                                <label className="form-label fw-semibold text-muted small">PRODUCT IMAGE</label>
                                <div className={`p-4 border rounded-3 text-center bg-light ${uploading ? 'opacity-50' : ''}`} style={{ borderStyle: 'dashed !important' }}>
                                    <input
                                        type='file'
                                        className="form-control mb-2"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                    {uploading && (
                                        <div className="d-flex align-items-center justify-content-center text-primary mt-2">
                                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                            <span>Uploading image...</span>
                                        </div>
                                    )}
                                    {form.image && (
                                        <div className="mt-3">
                                            <div className="small text-muted mb-2 text-truncate">Path: {form.image}</div>
                                            <img
                                                src={form.image?.startsWith('http') ? form.image : `${BASE_URL}${form.image}`}
                                                alt="Preview"
                                                className="rounded shadow-sm border"
                                                style={{ height: '100px', width: 'auto' }}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="col-12">
                                <label className="form-label fw-semibold text-muted small">DESCRIPTION</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Write detailed product information..."
                                    name='description'
                                    value={form.description}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="col-12 mt-4 pt-3 border-top d-flex gap-3">
                                <button type='submit' className="btn btn-primary px-5 py-2 fw-bold shadow-sm">
                                    {isNew ? 'Create Product' : 'Update Product'}
                                </button>
                                <button
                                    type='button'
                                    className="btn btn-outline-secondary px-5 py-2 fw-bold"
                                    onClick={() => navigate('/admin')}
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}