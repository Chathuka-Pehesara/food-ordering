import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export function OrderConfirmation() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Poll for up to 10 seconds to let PayHere notify the server
        let tries = 0;
        const poll = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
                if (data.paymentStatus === 'paid' || tries >= 5) { setLoading(false); return; }
            } catch { setLoading(false); return; }
            tries++;
            setTimeout(poll, 2000);
        };
        poll();
    }, [id]);

    if (loading) return (
        <div style={S.center}>
            <div style={S.spinner} />
            <p style={{ marginTop: 16, color: '#888' }}>Confirming your payment...</p>
        </div>
    );

    return (
        <div style={S.page}>
            <div style={S.confCard}>
                {order?.paymentStatus === 'paid' ? (
                    <>
                        <div style={S.icon}>✅</div>
                        <h1 style={{ color: '#10b981', margin: '16px 0 8px' }}>Payment Successful!</h1>
                        <p style={{ color: '#888', marginBottom: 24 }}>Your order has been confirmed and is being prepared.</p>
                    </>
                ) : (
                    <>
                        <div style={S.icon}>⏳</div>
                        <h1 style={{ color: '#f59e0b', margin: '16px 0 8px' }}>Order Placed</h1>
                        <p style={{ color: '#888', marginBottom: 24 }}>Payment is being verified. Check My Orders for updates.</p>
                    </>
                )}

                <div style={S.details}>
                    <div style={S.detailRow}><span>Order ID</span><span>#{id.slice(-8).toUpperCase()}</span></div>
                    <div style={S.detailRow}><span>Total</span><span style={{ color: '#e65c00', fontWeight: 700 }}>Rs. {order?.totalAmount?.toLocaleString()}</span></div>
                    <div style={S.detailRow}><span>Status</span><span>{order?.status?.replace(/_/g, ' ')}</span></div>
                    <div style={S.detailRow}><span>Delivery to</span><span style={{ maxWidth: 220, textAlign: 'right' }}>{order?.deliveryAddress}</span></div>
                </div>

                <div style={S.itemsList}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Items ordered</h3>
                    {order?.items?.map((item, i) => (
                        <div key={i} style={S.orderItem}>
                            <span>{item.name} × {item.quantity}</span>
                            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                    <Link to="/my-orders" style={S.ordersBtn}>My Orders</Link>
                    <Link to="/" style={S.menuBtn}>Order More</Link>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;

const S = {
    page: { background: '#f9f5f0', minHeight: '100vh', padding: '32px 16px' },
    container: { maxWidth: 760, margin: '0 auto' },
    card: { background: '#fff', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 },
    orderId: { fontWeight: 700, color: '#1a1a1a', marginRight: 10 },
    statusBadge: { display: 'inline-block', color: '#fff', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, marginRight: 6 },
    items: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    itemTag: { background: '#f5f5f5', borderRadius: 6, padding: '4px 10px', fontSize: 13, color: '#555' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    total: { fontWeight: 700, fontSize: 17, color: '#e65c00' },
    center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 8 },
    spinner: { width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #e65c00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    confCard: { background: '#fff', borderRadius: 18, padding: '40px 32px', maxWidth: 520, margin: '32px auto', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', textAlign: 'center' },
    icon: { fontSize: 60 },
    details: { background: '#f9f5f0', borderRadius: 10, padding: 16, marginBottom: 16, textAlign: 'left' },
    detailRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee', fontSize: 14 },
    itemsList: { background: '#f9f5f0', borderRadius: 10, padding: 16, textAlign: 'left', marginBottom: 8 },
    orderItem: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 14, borderBottom: '1px solid #eee' },
    ordersBtn: { background: '#1a1a1a', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 },
    menuBtn: { background: '#e65c00', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 },
};