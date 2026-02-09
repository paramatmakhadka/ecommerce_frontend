import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function MobileActionsDropdown({ items = [], className = '' }) {
    const [open, setOpen] = useState(false)
    const ref = useRef()

    useEffect(() => {
        const onDocClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('click', onDocClick)
        return () => document.removeEventListener('click', onDocClick)
    }, [])

    return (
        <div
            className={`mobile-actions-dropdown ${className}`}
            ref={ref}
            style={{ display: 'inline-block', position: 'relative' }}
        >
            <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={() => setOpen((s) => !s)}
                aria-expanded={open}
                aria-haspopup="true"
            >
                ⋯
            </button>

            {open && (
                <div
                    className="card shadow-sm bg-white"
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        zIndex: 2000,
                        borderRadius: 6,
                        overflow: 'hidden',
                        minWidth: 140,
                        maxWidth: 240,
                    }}
                >
                    <ul className="list-group list-group-flush m-0 p-0">
                        {items.map((it, idx) => (
                            <li key={idx} className="list-group-item p-0">
                                {it.to ? (
                                    <Link
                                        to={it.to}
                                        className="d-block w-100 px-3 py-2 text-decoration-none text-dark"
                                        onClick={() => setOpen(false)}
                                        style={{ textAlign: 'left' }}
                                    >
                                        {it.label}
                                    </Link>
                                ) : (
                                    <button
                                        className={`d-block w-100 px-3 py-2 text-start btn ${it.className || ''}`}
                                        onClick={(e) => {
                                            setOpen(false)
                                            it.onClick && it.onClick(e)
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            textAlign: 'left',
                                        }}
                                    >
                                        {it.label}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
