import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const STATUS_COLORS = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    preparing: '#8b5cf6',
    out_for_delivery: '#06b6d4',
    delivered: '#10b981',
    cancelled: '#ef4444',
};

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/my')
            .then(({ data }) => setOrders(data))
            .catch(() => toast.error('Failed to load orders'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={S.center}><div style={S.spinner} /></div>;

    if (orders.length === 0) return (
        <div style={S.center}>
            <p style={{ fontSize: 50 }}>📦</p>
            <h2>No orders yet</h2>
            <p style={{ color: '#888' }}>Your order history will appear here</p>
        </div>
    );

    return (
        <div style={S.page}>
            <div style={S.container}>
                <h2 style={{ margin: '0 0 24px', fontSize: 26 }}>My Orders</h2>
                {orders.map(order => (
                    <div key={order._id} style={S.card}>
                        <div style={S.cardHeader}>
                            <div>
                                <span style={S.orderId}>Order #{order._id.slice(-8).toUpperCase()}</span>
                                <span style={{ ...S.statusBadge, background: STATUS_COLORS[order.status] || '#888' }}>
                                    {order.status.replace(/_/g, ' ')}
                                </span>
                                {order.paymentStatus === 'paid'
                                    ? <span style={{ ...S.statusBadge, background: '#10b981' }}>Paid ✓</span>
                                    : <span style={{ ...S.statusBadge, background: '#f59e0b' }}>Unpaid</span>
                                }
                            </div>
                            <div style={{ color: '#888', fontSize: 13 }}>
                                {new Date(order.createdAt).toLocaleString()}
                            </div>
                        </div>

                        <div style={S.items}>
                            {order.items.map((item, i) => (
                                <span key={i} style={S.itemTag}>
                                    {item.name} × {item.quantity}
                                </span>
                            ))}
                        </div>

                        <div style={S.cardFooter}>
                            <span style={{ color: '#888', fontSize: 13 }}>📍 {order.deliveryAddress}</span>
                            <span style={S.total}>Rs. {order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

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
};
