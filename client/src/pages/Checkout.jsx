import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function Checkout() {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const nav = useNavigate();
    const formRef = useRef(null);

    const [address, setAddress] = useState(user?.address || '');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [payhereData, setPayhereData] = useState(null);

    if (cart.length === 0) {
        nav('/'); return null;
    }

    const placeOrder = async () => {
        if (!address.trim()) return toast.error('Please enter delivery address');
        setLoading(true);
        try {
            // Step 1: create order
            const orderItems = cart.map(i => ({
                foodItem: i._id, name: i.name, price: i.price, quantity: i.quantity,
            }));
            const { data: order } = await api.post('/orders', { items: orderItems, deliveryAddress: address, notes });

            // Step 2: get PayHere payment params
            const { data: ph } = await api.post('/payments/initiate', { orderId: order._id });
            setPayhereData(ph);
            clearCart();

            // Step 3: auto-submit hidden form to PayHere
            setTimeout(() => formRef.current?.submit(), 100);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Order failed');
            setLoading(false);
        }
    };

    return (
        <div style={S.page}>
            <div style={S.container}>
                <div style={S.left}>
                    <h2 style={{ margin: '0 0 20px' }}>Checkout</h2>

                    <div style={S.section}>
                        <h3>Delivery Address</h3>
                        <textarea
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            rows={3}
                            style={S.textarea}
                            placeholder="Enter full delivery address..."
                        />
                    </div>

                    <div style={S.section}>
                        <h3>Special Instructions</h3>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={2}
                            style={S.textarea}
                            placeholder="No onions, extra sauce, etc."
                        />
                    </div>

                    <div style={S.payInfo}>
                        <span>🔒</span>
                        <p style={{ margin: 0 }}>You'll be redirected to <strong>PayHere Sandbox</strong> to complete payment securely.</p>
                    </div>
                </div>

                <div style={S.summary}>
                    <h3 style={{ margin: '0 0 20px' }}>Order Summary</h3>
                    {cart.map(item => (
                        <div key={item._id} style={S.row}>
                            <span>{item.name} × {item.quantity}</span>
                            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                    <hr style={{ margin: '16px 0', borderColor: '#eee' }} />
                    <div style={{ ...S.row, fontWeight: 700, fontSize: 17 }}>
                        <span>Total</span>
                        <span style={{ color: '#e65c00' }}>Rs. {total.toLocaleString()}</span>
                    </div>
                    <button onClick={placeOrder} style={S.payBtn} disabled={loading}>
                        {loading ? 'Processing...' : `Pay Rs. ${total.toLocaleString()}`}
                    </button>
                </div>
            </div>

            {/* Hidden PayHere form — auto-submits after order is created */}
            {payhereData && (
                <form ref={formRef} method="POST" action="https://sandbox.payhere.lk/pay/checkout" style={{ display: 'none' }}>
                    {Object.entries(payhereData).map(([k, v]) => (
                        <input key={k} type="hidden" name={k} value={v} />
                    ))}
                </form>
            )}
        </div>
    );
}

export default Checkout;

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