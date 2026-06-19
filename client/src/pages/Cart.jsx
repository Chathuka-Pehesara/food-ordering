import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cart, removeFromCart, updateQty, total, clearCart } = useCart();

    if (cart.length === 0) return (
        <div style={S.empty}>
            <p style={{ fontSize: 60 }}>🛒</p>
            <h2>Your cart is empty</h2>
            <Link to="/" style={S.shopBtn}>Browse Menu</Link>
        </div>
    );

    return (
        <div style={S.page}>
            <div style={S.container}>
                <div style={S.left}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ margin: 0 }}>Your Cart ({cart.length} items)</h2>
                        <button onClick={clearCart} style={S.clearBtn}>Clear All</button>
                    </div>

                    {cart.map(item => (
                        <div key={item._id} style={S.item}>
                            <img
                                src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/80'}
                                alt={item.name}
                                style={S.itemImg}
                            />
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: 16 }}>{item.name}</h4>
                                <p style={{ margin: 0, color: '#e65c00', fontWeight: 700 }}>Rs. {item.price.toLocaleString()}</p>
                            </div>
                            <div style={S.qtyWrap}>
                                <button style={S.qBtn} onClick={() => updateQty(item._id, item.quantity - 1)}>−</button>
                                <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                                <button style={S.qBtn} onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
                            </div>
                            <div style={{ minWidth: 90, textAlign: 'right' }}>
                                <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                <button onClick={() => removeFromCart(item._id)} style={S.removeBtn}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={S.summary}>
                    <h3 style={{ margin: '0 0 20px' }}>Order Summary</h3>
                    {cart.map(item => (
                        <div key={item._id} style={S.summaryRow}>
                            <span>{item.name} × {item.quantity}</span>
                            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                    <hr style={{ margin: '16px 0', borderColor: '#eee' }} />
                    <div style={{ ...S.summaryRow, fontWeight: 700, fontSize: 17 }}>
                        <span>Total</span>
                        <span style={{ color: '#e65c00' }}>Rs. {total.toLocaleString()}</span>
                    </div>
                    <Link to="/checkout" style={S.checkoutBtn}>Proceed to Checkout →</Link>
                </div>
            </div>
        </div>
    );
}

const S = {
    page: { background: '#f9f5f0', minHeight: '100vh', padding: '32px 16px' },
    container: { maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' },
    left: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
    item: { display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    itemImg: { width: 70, height: 70, objectFit: 'cover', borderRadius: 10 },
    qtyWrap: { display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', borderRadius: 8, padding: '4px 8px' },
    qBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#e65c00', fontWeight: 700, lineHeight: 1 },
    removeBtn: { background: 'none', border: 'none', color: '#cc0000', fontSize: 12, cursor: 'pointer' },
    summary: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', position: 'sticky', top: 80 },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 },
    checkoutBtn: { display: 'block', marginTop: 20, background: '#e65c00', color: '#fff', textDecoration: 'none', textAlign: 'center', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: 16 },
    payBtn: { width: '100%', marginTop: 20, background: '#1a9e4a', color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontWeight: 700, fontSize: 16, cursor: 'pointer' },
    clearBtn: { background: 'none', border: '1px solid #ccc', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', color: '#cc0000', fontSize: 13 },
    empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 },
    shopBtn: { background: '#e65c00', color: '#fff', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 16 },
    section: { marginBottom: 20 },
    textarea: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' },
    payInfo: { display: 'flex', gap: 10, alignItems: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 14, marginTop: 10, color: '#166534', fontSize: 14 },
};
