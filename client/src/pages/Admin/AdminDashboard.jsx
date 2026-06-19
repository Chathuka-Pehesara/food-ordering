
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    pending: '#f59e0b', confirmed: '#3b82f6', preparing: '#8b5cf6',
    out_for_delivery: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444',
};

export function AdminDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get('/admin/dashboard')
            .then(({ data }) => setData(data))
            .catch(() => toast.error('Failed to load dashboard'));
    }, []);

    if (!data) return <div style={DS.center}><div style={DS.spinner} /></div>;

    const stats = [
        { label: 'Total Orders', value: data.totalOrders, icon: '📦', color: '#3b82f6' },
        { label: 'Customers', value: data.totalCustomers, icon: '👥', color: '#8b5cf6' },
        { label: 'Food Items', value: data.totalFoods, icon: '🍕', color: '#f59e0b' },
        { label: 'Revenue (LKR)', value: `Rs. ${data.totalRevenue.toLocaleString()}`, icon: '💰', color: '#10b981' },
    ];

    return (
        <div style={DS.page}>
            <h1 style={DS.title}>Dashboard</h1>

            <div style={DS.statsGrid}>
                {stats.map(s => (
                    <div key={s.label} style={DS.statCard}>
                        <div style={{ ...DS.statIcon, background: s.color + '20', color: s.color }}>{s.icon}</div>
                        <div>
                            <div style={DS.statVal}>{s.value}</div>
                            <div style={DS.statLbl}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={DS.section}>
                <h2 style={DS.sectionTitle}>Recent Orders</h2>
                <table style={DS.table}>
                    <thead>
                        <tr>{['Order ID', 'Customer', 'Items', 'Total', 'Status'].map(h => (
                            <th key={h} style={DS.th}>{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody>
                        {data.recentOrders.map(o => (
                            <tr key={o._id} style={DS.tr}>
                                <td style={DS.td}>#{o._id.slice(-8).toUpperCase()}</td>
                                <td style={DS.td}>{o.customer?.name}</td>
                                <td style={DS.td}>{o.items.length} item(s)</td>
                                <td style={DS.td}>Rs. {o.totalAmount.toLocaleString()}</td>
                                <td style={DS.td}>
                                    <span style={{ ...DS.badge, background: STATUS_COLORS[o.status] || '#888' }}>
                                        {o.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;

const S = {
    wrap: { display: 'flex', minHeight: '100vh', background: '#f9f5f0' },
    sidebar: { width: 240, background: '#1a1a2e', color: '#fff', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 },
    logo: { padding: '0 24px 24px', fontSize: 18, fontWeight: 800, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 8 },
    adminLabel: { background: '#e65c00', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 20, marginLeft: 8, fontWeight: 700 },
    navLink: { display: 'block', padding: '12px 24px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' },
    active: { background: 'rgba(230,92,0,0.2)', color: '#fff', borderRight: '3px solid #e65c00' },
    sideFooter: { padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' },
    logoutBtn: { width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: 6, cursor: 'pointer' },
    main: { flex: 1, padding: 28, overflow: 'auto' },
};

const DS = {
    page: { maxWidth: 1100, margin: '0 auto' },
    title: { margin: '0 0 24px', fontSize: 26, fontWeight: 700 },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 },
    statCard: { background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', gap: 16, alignItems: 'center' },
    statIcon: { width: 52, height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 },
    statVal: { fontSize: 22, fontWeight: 800, color: '#1a1a1a' },
    statLbl: { fontSize: 13, color: '#888', marginTop: 2 },
    section: { background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
    sectionTitle: { margin: '0 0 16px', fontSize: 18, fontWeight: 700 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '10px 12px', fontSize: 13, color: '#888', fontWeight: 600, borderBottom: '1px solid #f0f0f0' },
    tr: { borderBottom: '1px solid #f9f9f9' },
    td: { padding: '12px', fontSize: 14, color: '#333' },
    badge: { color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, display: 'inline-block' },
    center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' },
    spinner: { width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #e65c00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
};