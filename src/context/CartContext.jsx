import React, { createContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export const CartContext = createContext()

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([])
    const [couponCode, setCouponCode] = useState('')
    const [specialNote, setSpecialNote] = useState('')
    const [discount, setDiscount] = useState(0) // percentage or fixed amount
    const [discountType, setDiscountType] = useState('Percentage')
    const [appliedCoupon, setAppliedCoupon] = useState(null)

    useEffect(() => {
        const stored = localStorage.getItem('cart')
        if (stored) {
            const data = JSON.parse(stored)
            if (Array.isArray(data)) {
                setCartItems(data)
            } else {
                setCartItems(data.items || [])
                setCouponCode(data.coupon || '')
                setSpecialNote(data.note || '')
                setDiscount(data.discount || 0)
                setDiscountType(data.discountType || 'Percentage')
                setAppliedCoupon(data.appliedCoupon || null)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify({
            items: cartItems,
            coupon: couponCode,
            note: specialNote,
            discount,
            discountType,
            appliedCoupon
        }))
    }, [cartItems, couponCode, specialNote, discount, discountType, appliedCoupon])

    const addToCart = (product, qty = 1) => {
        setCartItems((prev) => {
            const exist = prev.find((i) => i._id === product._id)
            if (exist) {
                const updated = prev.map((i) => (i._id === product._id ? { ...i, qty: i.qty + qty } : i))
                toast.success(`${product.name} quantity updated in cart`)
                return updated
            }
            toast.success(`${product.name} added to cart`)
            return [...prev, { ...product, qty }]
        })
    }

    const removeFromCart = (id) => {
        setCartItems((prev) => {
            const removed = prev.find((i) => i._id === id)
            toast.success(`${removed ? removed.name : 'Item'} removed from cart`)
            return prev.filter((i) => i._id !== id)
        })
    }

    const updateQty = (id, qty) => {
        setCartItems((prev) => {
            const updated = prev.map((i) => (i._id === id ? { ...i, qty } : i))
            const item = prev.find(i => i._id === id)
            if (item) toast.info(`${item.name} quantity set to ${qty}`)
            return updated
        })
    }

    const clearCart = () => {
        setCartItems([])
        setCouponCode('')
        setSpecialNote('')
        setDiscount(0)
        setDiscountType('Percentage')
        setAppliedCoupon(null)
    }

    return (
        <CartContext.Provider value={{
            cartItems,
            couponCode,
            setCouponCode,
            specialNote,
            setSpecialNote,
            discount,
            setDiscount,
            discountType,
            setDiscountType,
            appliedCoupon,
            setAppliedCoupon,
            addToCart,
            removeFromCart,
            updateQty,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    )
}
