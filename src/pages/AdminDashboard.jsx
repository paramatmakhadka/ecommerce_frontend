import React, { useEffect, useState, useContext } from 'react'
import axios from '../api/axios'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import MobileActionsDropdown from '../components/MobileActionsDropdown'

export default function AdminDashboard() {
    const { user, logout } = useContext(AuthContext)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [coupons, setCoupons] = useState([])
    const [stats, setStats] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const activeTab = searchParams.get('tab') || 'overview'
    const navigate = useNavigate()

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'Percentage',
        discountValue: 0,
        expiryDate: '',
        isActive: true
    })

    const setActiveTab = (tab) => {
        setSearchParams({ tab })
        setSearchQuery('') // Clear search when switching tabs
        setSidebarOpen(false) // Close sidebar on mobile after selecting tab
    }

    useEffect(() => {
        fetchProducts()
        fetchCategories()
        fetchUsers()
        fetchOrders()
        fetchCoupons()
        fetchStats()
    }, [])

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products', { withCredentials: true })
            setProducts(data)
        } catch (err) { console.error(err) }
    }

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/api/categories', { withCredentials: true })
            setCategories(data)
        } catch (err) { console.error(err) }
    }

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/admin/users')
            setUsers(data)
        } catch (err) { console.error(err) }
    }

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/orders', { withCredentials: true })
            setOrders(data)
        } catch (err) { console.error(err) }
    }

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get('/api/coupons', { withCredentials: true })
            setCoupons(data)
        } catch (err) { console.error(err) }
    }

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/api/admin/stats', { withCredentials: true })
            setStats(data)
        } catch (err) { console.error(err) }
    }

    const handleCreateCoupon = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/coupons', newCoupon, { withCredentials: true })
            toast.success('Coupon created')
            setNewCoupon({ code: '', discountType: 'Percentage', discountValue: 0, expiryDate: '', isActive: true })
            fetchCoupons()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create coupon')
        }
    }

    const deleteCoupon = async (id) => {
        if (!confirm('Delete this coupon?')) return
        try {
            await axios.delete(`/api/coupons/${id}`, { withCredentials: true })
            fetchCoupons()
            toast.success('Coupon deleted')
        } catch (err) {
            console.error(err)
            toast.error('Delete failed')
        }
    }

    const deleteProduct = async (id) => {
        if (!confirm('Delete this product?')) return
        try {
            await axios.delete(`/api/products/${id}`, { withCredentials: true })
            fetchProducts()
            toast.success('Product deleted')
        } catch (err) {
            console.error(err)
            toast.error('Delete failed')
        }
    }

    const deleteCategory = async (id) => {
        if (!confirm('Delete this category?')) return
        try {
            await axios.delete(`/api/categories/${id}`)
            fetchCategories()
            toast.success('Category deleted')
        } catch (err) {
            console.error(err)
            toast.error('Delete failed')
        }
    }

    const deleteUser = async (id) => {
        if (!confirm('Delete this user?')) return
        try {
            await axios.delete(`/api/admin/users/${id}`)
            fetchUsers()
            toast.success('User deleted')
        } catch (err) {
            console.error(err)
            toast.error('Delete failed')
        }
    }

    const deleteOrder = async (id) => {
        if (!confirm('Delete this order?')) return
        try {
            await axios.delete(`/api/orders/${id}`, { withCredentials: true })
            fetchOrders()
            toast.success('Order deleted')
        } catch (err) {
            console.error(err)
            toast.error('Delete failed')
        }
    }

    return (
        <div className="d-flex flex-column flex-md-row min-vh-100">
            {/* ===== MOBILE TOGGLE BUTTON ===== */}
            <button
                className="btn btn-dark d-md-none w-100 rounded-0 py-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <i className="bi bi-list"></i> {sidebarOpen ? 'Close' : 'Menu'}
            </button>

            {/* ===== LEFT SIDEBAR ===== */}
            <aside
                className={`bg-dark text-white border-end p-4 ${sidebarOpen ? 'd-flex' : 'd-none'} d-md-flex flex-column`}
                style={{
                    width: '280px',
                    minHeight: '100vh',
                    position: 'relative',
                    zIndex: 1000
                }}
            >
                {/* User Info */}
                <div className="mb-4 pb-4 border-bottom border-secondary">
                    <h6 className="text-light small text-uppercase mb-2">Logged in as</h6>
                    <p className="fw-bold mb-3">{user?.name}</p>
                    <button
                        onClick={() => {
                            logout()
                            navigate('/')
                        }}
                        className="btn btn-danger btn-sm w-100"
                    >
                        Logout
                    </button>
                </div>

                {/* Navigation */}
                <nav className="nav flex-column gap-2">
                    <h6 className="text-light small text-uppercase mb-3">Navigation</h6>
                    {['overview', 'products', 'categories', 'users', 'orders', 'coupons'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`nav-link text-start border-0 rounded px-3 py-2 text-capitalize ${activeTab === tab
                                ? 'bg-primary text-white fw-bold'
                                : 'text-light bg-dark-hover'
                                }`}
                            style={{
                                backgroundColor: activeTab === tab ? '#0d6efd' : 'transparent',
                                color: 'white'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main className="flex-grow-1 p-3 p-md-4" style={{ overflowY: 'auto' }}>
                <div className="container-fluid">
                    <div className="mb-4">
                        <h1 className="h4 h3-md mb-0 text-capitalize">{activeTab} Management</h1>
                    </div>

                    {activeTab === 'overview' && stats && (
                        <div className="animate__animated animate__fadeIn">
                            {/* UI Change: Used Bootstrap Grid and Cards for Stats */}
                            <div className="row g-4 mb-5 row-cols-1 row-cols-md-3 row-cols-lg-5 text-nowrap">
                                <div className="col">
                                    <div className="card border-0 shadow-sm h-100 p-3">
                                        <div className="card-body text-center p-2">
                                            <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Total Revenue</h6>
                                            <h5 className="fw-bold mb-0">Rs {stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card border-0 shadow-sm h-100 p-3">
                                        <div className="card-body text-center p-2">
                                            <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Orders</h6>
                                            <h3 className="fw-bold mb-0">{stats.orderCount}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card border-0 shadow-sm h-100 p-3">
                                        <div className="card-body text-center p-2">
                                            <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Products</h6>
                                            <h3 className="fw-bold mb-0">{stats.productCount}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card border-0 shadow-sm h-100 p-3">
                                        <div className="card-body text-center p-2">
                                            <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Users</h6>
                                            <h3 className="fw-bold mb-0">{stats.userCount}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card border-0 shadow-sm h-100 p-3">
                                        <div className="card-body text-center p-2">
                                            <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Coupons</h6>
                                            <h3 className="fw-bold mb-0">{stats.couponCount || 0}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {stats.salesData && stats.salesData.length > 0 && (
                                <div className="card border-0 shadow-sm p-4">
                                    <h5 className="card-title mb-4 fw-bold">Sales (last 7 days)</h5>
                                    <SalesChart data={stats.salesData} />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="card border-0 shadow-sm p-3 p-md-4 animate__animated animate__fadeIn">
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
                                <h2 className="h4 mb-0">Products</h2>
                                <div className="d-flex gap-2 flex-grow-1 flex-sm-grow-0" style={{ maxWidth: '100%', minWidth: '280px' }}>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-search"></i></span>
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-0"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Link to='/admin/product/new' className="btn btn-primary btn-sm px-3">Create</Link>
                            </div>
                            {/* table-hover and responsive classes */}
                            <div className="table-responsive">
                                <table className="table table-hover align-middle table-sm">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-2 px-md-3">Name</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th className="text-end px-2 px-md-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.filter(p => (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((p) => (
                                            <tr key={p._id}>
                                                <td className="px-2 px-md-3 fw-medium">
                                                    <span className="d-inline d-md-none">
                                                        {(p.name || 'Unnamed Product').length > 15 ? `${(p.name || 'Unnamed Product').slice(0, 15)}...` : (p.name || 'Unnamed Product')}
                                                    </span>
                                                    <span className="d-none d-md-inline">{p.name || 'Unnamed Product'}</span>
                                                </td>
                                                <td>Rs {p.price}</td>
                                                <td>
                                                    <span className={`badge ${p.countInStock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                        {p.countInStock}
                                                    </span>
                                                </td>
                                                <td className="text-end px-3">
                                                    <div className="d-none d-md-inline-flex">
                                                        <Link to={`/admin/product/${p._id}/edit`} className="btn btn-sm btn-outline-secondary me-2">Edit</Link>
                                                        <button onClick={() => deleteProduct(p._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                                                    </div>

                                                    <div className="d-md-none d-inline-block">
                                                        <MobileActionsDropdown
                                                            items={[
                                                                { label: 'Edit', to: `/admin/product/${p._id}/edit` },
                                                                { label: 'Delete', onClick: () => deleteProduct(p._id), className: 'text-danger' }
                                                            ]}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div className="card border-0 shadow-sm p-3 p-md-4">
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
                                <h2 className="h4 mb-0">Categories</h2>
                                <Link to='/admin/category/new' className="btn btn-primary btn-sm px-3">Create</Link>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle table-sm">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-2 px-md-3">Name</th>
                                            <th className="text-end px-2 px-md-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((c) => (
                                            <tr key={c._id}>
                                                <td className="px-2 px-md-3">{c.name}</td>
                                                <td className="text-end px-2 px-md-3">
                                                       <div className="d-none d-md-inline-flex">
                                                           <Link to={`/admin/category/${c._id}/edit`} className="btn btn-sm btn-outline-secondary me-2">Edit</Link>
                                                           <button onClick={() => deleteCategory(c._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                                                       </div>

                                                    <div className="d-md-none d-inline-block">
                                                        <MobileActionsDropdown items={[
                                                            { label: 'Edit', to: `/admin/category/${c._id}/edit` },
                                                            { label: 'Delete', onClick: () => deleteCategory(c._id), className: 'text-danger' }
                                                        ]} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="card border-0 shadow-sm p-3 p-md-4">
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
                                <h2 className="h4 mb-0">Users</h2>
                                <Link to='/admin/user/new' className="btn btn-primary btn-sm px-3">Create</Link>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle table-sm">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-2 px-md-3">Name</th>
                                            <th className="d-none d-sm-table-cell">Email</th>
                                            <th className="d-none d-lg-table-cell">Admin Status</th>
                                            <th className="text-end px-2 px-md-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u._id}>
                                                <td className="px-2 px-md-3">{u.name}</td>
                                                <td className="d-none d-sm-table-cell"><small>{u.email}</small></td>
                                                <td className="d-none d-lg-table-cell">
                                                    {u.isAdmin ? <span className="badge rounded-pill bg-primary">Admin</span> : <span className="badge rounded-pill bg-light text-dark">User</span>}
                                                </td>
                                                <td className="text-end px-2 px-md-3">
                                                       <div className="d-none d-md-inline-flex">
                                                           <Link to={`/admin/user/${u._id}/edit`} className="btn btn-sm btn-outline-secondary me-2">Edit</Link>
                                                           <button onClick={() => deleteUser(u._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                                                       </div>

                                                    <div className="d-md-none d-inline-block">
                                                        <MobileActionsDropdown items={[
                                                            { label: 'Edit', to: `/admin/user/${u._id}/edit` },
                                                            { label: 'Delete', onClick: () => deleteUser(u._id), className: 'text-danger' }
                                                        ]} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="card border-0 shadow-sm p-3 p-md-4 animate__animated animate__fadeIn">
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
                                <h2 className="h4 mb-0">Orders</h2>
                                <div className="d-flex gap-2 flex-grow-1 flex-sm-grow-0" style={{ maxWidth: '100%', minWidth: '200px' }}>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text bg-white border-end-0 text-muted\">🔍</span>
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-0"
                                            placeholder="Search by ID or Customer..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle table-sm\" style={{ fontSize: '0.85rem' }}>
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-2 px-md-3\">ID</th>
                                            <th>Customer</th>
                                            <th className="d-none d-md-table-cell">Date</th>
                                            <th>Total</th>
                                            <th className="d-none d-lg-table-cell">Payment</th>
                                            <th className="d-none d-lg-table-cell">Status</th>
                                            <th className="text-end px-2 px-md-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.filter(o =>
                                            o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (o.user ? o.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) : o.shippingAddress?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                                        ).map((o) => (
                                            <tr key={o._id}>
                                                <td className="px-2 px-md-3 text-muted\"><small>{o._id.substring(0, 8)}</small></td>
                                                <td><small>{o.user ? o.user.name : (o.shippingAddress?.name || 'N/A') + ' (Guest)'}</small></td>
                                                <td className="d-none d-md-table-cell\"><small>{new Date(o.createdAt).toLocaleDateString()}</small></td>
                                                <td className="fw-bold\"><small>Rs {o.totalPrice.toFixed(2)}</small></td>
                                                <td className="d-none d-lg-table-cell\">
                                                    <span className={`badge px-2 py-1 ${o.isPaid ? 'bg-success-subtle text-success border border-success' : 'bg-warning-subtle text-warning border border-warning'}`}>
                                                        {o.isPaid ? 'Received' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="d-none d-lg-table-cell\">
                                                    <span className={`badge px-2 py-1 ${o.status === 'Delivered' ? 'bg-success' : o.status === 'Canceled' ? 'bg-danger' : o.status === 'Refunded' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                                <td className="text-end px-2 px-md-3">
                                                    <div className="d-none d-md-inline-flex">
                                                        <button onClick={() => navigate(`/admin/order/${o._id}`)} className="btn btn-sm btn-outline-secondary me-1">Details</button>
                                                        <button onClick={() => deleteOrder(o._id)} className="btn btn-sm btn-outline-danger ms-1">Delete</button>
                                                    </div>

                                                    <div className="d-md-none d-inline-block">
                                                        <MobileActionsDropdown items={[
                                                            { label: 'Details', onClick: () => navigate(`/admin/order/${o._id}`) },
                                                            { label: 'Delete', onClick: () => deleteOrder(o._id), className: 'text-danger' }
                                                        ]} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'coupons' && (
                        <div className="card border-0 shadow-sm p-3 p-md-4 animate__animated animate__fadeIn">
                            <h2 className="h4 mb-4">Coupon Management</h2>

                            {/* Create Coupon Form */}
                            <form onSubmit={handleCreateCoupon} className="mb-5 p-3 p-md-4 border rounded bg-light\">
                                <h6 className="fw-bold mb-3">Create New Coupon</h6>
                                <div className="row g-2 g-md-3">
                                    <div className="col-12 col-sm-6 col-md-3">
                                        <label className="form-label small fw-bold\">CODE</label>
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="e.g. SAVE20"
                                            value={newCoupon.code}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-2">
                                        <label className="form-label small fw-bold\">TYPE</label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={newCoupon.discountType}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                        >
                                            <option value="Percentage\">Percentage (%)</option>
                                            <option value="Amount\">Fixed Amount (Rs)</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-2">
                                        <label className="form-label small fw-bold\">VALUE</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={newCoupon.discountValue}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-3">
                                        <label className="form-label small fw-bold">EXPIRY DATE</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-sm"
                                            value={newCoupon.expiryDate}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-2 d-flex align-items-end">
                                        <button type="submit" className="btn btn-primary btn-sm w-100">Create</button>
                                    </div>
                                </div>
                            </form>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle table-sm">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-2 px-md-3">Code</th>
                                            <th>Discount</th>
                                            <th>Expiry</th>
                                            <th>Status</th>
                                            <th className="text-end px-2 px-md-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coupons.map((c) => (
                                            <tr key={c._id}>
                                                <td className="px-2 px-md-3 fw-bold\">{c.code}</td>
                                                <td><small>{c.discountType === 'Percentage' ? `${c.discountValue}%` : `Rs ${c.discountValue}`}</small></td>
                                                <td><small>{new Date(c.expiryDate).toLocaleDateString()}</small></td>
                                                <td>
                                                    <span className={`badge badge-sm ${new Date(c.expiryDate) > new Date() ? 'bg-success' : 'bg-danger'}`}>
                                                        {new Date(c.expiryDate) > new Date() ? 'Active' : 'Expired'}
                                                    </span>
                                                </td>
                                                <td className="text-end px-2 px-md-3">
                                                    <div className="d-none d-md-inline-flex">
                                                        <button onClick={() => deleteCoupon(c._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                                                    </div>

                                                    <div className="d-md-none d-inline-block">
                                                        <MobileActionsDropdown items={[{ label: 'Delete', onClick: () => deleteCoupon(c._id), className: 'text-danger' }]} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {coupons.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4 text-muted\">No coupons found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function SalesChart({ data, width = 800, height = 220, color = '#0d6efd' }) {
    if (!data || data.length === 0) return null
    const values = data.map(d => d.total)
    const labels = data.map(d => d.date.slice(5))
    const max = Math.max(...values, 1)
    const pad = 40
    const w = width
    const h = height
    const stepX = (w - pad * 2) / Math.max(1, values.length - 1)

    const points = values.map((v, i) => {
        const x = pad + i * stepX
        const y = pad + (1 - v / max) * (h - pad * 2.5)
        return `${x},${y}`
    }).join(' ')

    const fillPoints = `${pad},${h - pad} ` + points + ` ${w - pad},${h - pad}`

    return (
        <div className="table-responsive py-3">
            <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className="d-block mx-auto overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                    const y = pad + p * (h - pad * 2.5)
                    return <line key={i} x1={pad} y1={y} x2={w - pad} y2={y} stroke="#f1f3f5" strokeWidth="1" />
                })}

                <polyline fill="url(#chartGradient)" points={fillPoints} />
                <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />

                {values.map((v, i) => {
                    const x = pad + i * stepX
                    const y = pad + (1 - v / max) * (h - pad * 2.5)
                    return (
                        <g key={i} className="chart-point">
                            <circle cx={x} cy={y} r={5} fill="#fff" stroke={color} strokeWidth="2.5" />
                            <text x={x} y={y - 12} fontSize={10} textAnchor="middle" fill={color} fontWeight="bold">Rs {v.toFixed(0)}</text>
                            <text x={x} y={h - 15} fontSize={11} textAnchor="middle" fill="#adb5bd" fontWeight="500">{labels[i]}</text>
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}