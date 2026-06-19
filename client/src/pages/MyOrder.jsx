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
