import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function AdminUserForm() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        isAdmin: false
    })
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = Boolean(id)

    useEffect(() => {
        if (!isEdit) return
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`/api/admin/users/${id}`)
                setForm({ name: data.name || '', email: data.email || '', password: '', isAdmin: data.isAdmin || false })
            } catch (err) { console.error(err); toast.error('Failed to load user') }
        }
        fetchUser()
    }, [id])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            if (isEdit) {
                // when editing, omit password if empty
                const payload = { name: form.name, email: form.email, isAdmin: form.isAdmin }
                if (form.password) payload.password = form.password
                await axios.put(`/api/admin/users/${id}`, payload)
                toast.success('User updated')
            } else {
                await axios.post('/api/admin/users', form)
                toast.success('User created')
            }
            navigate('/admin')
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || 'User save failed')
        }
    }

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto' }}>
            <h2>{isEdit ? 'Edit User' : 'Create New User'}</h2>
            <form onSubmit={submitHandler}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                    <input
                        name='name'
                        type='text'
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                    <input
                        name='email'
                        type='email'
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password{isEdit ? ' (leave blank to keep current)' : ''}</label>
                    <input
                        name='password'
                        type='password'
                        value={form.password}
                        onChange={handleChange}
                        required={!isEdit}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        <input
                            name='isAdmin'
                            type='checkbox'
                            checked={form.isAdmin}
                            onChange={handleChange}
                        />
                        Admin User
                    </label>
                </div>
                <button type='submit' style={{ padding: '0.5rem 1rem' }}>{isEdit ? 'Save Changes' : 'Create User'}</button>
                <button
                    type='button'
                    onClick={() => navigate('/admin')}
                    style={{ marginLeft: 8, padding: '0.5rem 1rem' }}
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}
