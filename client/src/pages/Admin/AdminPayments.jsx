
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/payments')
            .then(({ data }) => setPayments(data))
            .catch(() => toast.error('Failed to load payments'))
            .finally(() => setLoading(false));
    }, []);

    const total = payments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div>
            <div style={S.header}>
                <h1 style={S.title}>Payments</h1>
                <div style={{ background: '#dcfce7', color: '#166534', borderRadius: 10, padding: '10px 20px', fontWeight: 700 }}>
                    Total Revenue: Rs. {total.toLocaleString()}
                </div>
            </div>

            {loading ? <div style={S.center}><div style={S.spinner} /></div> : (
                <div style={S.tableWrap}>
                    <table style={S.table}>
                        <thead>
                            <tr>{['Payment ID', 'Customer', 'Order', 'Amount', 'Method', 'Status', 'Paid At'].map(h => (
                                <th key={h} style={S.th}>{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody>
                            {payments.map(p => (
                                <tr key={p._id} style={S.tr}>
                                    <td style={S.td}><code style={{ fontSize: 12 }}>{p._id.slice(-8)}</code></td>
                                    <td style={S.td}>
                                        <div style={{ fontWeight: 600 }}>{p.customer?.name}</div>
                                        <div style={{ fontSize: 12, color: '#888' }}>{p.customer?.email}</div>
                                    </td>
                                    <td style={S.td}>#{p.order?._id?.slice(-8).toUpperCase()}</td>
                                    <td style={S.td} style={{ fontWeight: 700, color: '#10b981' }}>Rs. {p.amount.toLocaleString()}</td>
                                    <td style={S.td}>{p.method || 'PayHere'}</td>
                                    <td style={S.td}>
                                        <span style={{ ...S.badge, background: p.statusCode === '2' ? '#10b981' : '#f59e0b' }}>
                                            {p.statusCode === '2' ? 'Success' : p.statusCode || 'Pending'}
                                        </span>
                                    </td>
                                    <td style={S.td}>{p.paidAt ? new Date(p.paidAt).toLocaleString() : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;

const S = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
    title: { margin: 0, fontSize: 26, fontWeight: 700 },
    select: { padding: '8px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none' },
    searchInput: { padding: '8px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', minWidth: 240 },
    tableWrap: { background: '#fff', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', overflow: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', minWidth: 700 },
    th: { textAlign: 'left', padding: '12px 16px', fontSize: 13, color: '#888', fontWeight: 600, borderBottom: '2px solid #f0f0f0', whiteSpace: 'nowrap' },
    tr: { borderBottom: '1px solid #f9f9f9', transition: 'background 0.15s' },
    td: { padding: '12px 16px', fontSize: 14, color: '#333' },
    badge: { color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, display: 'inline-block', background: '#888' },
    statusSel: { padding: '6px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, outline: 'none' },
    avatar: { width: 32, height: 32, borderRadius: '50%', background: '#e65c00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 },
    center: { display: 'flex', justifyContent: 'center', padding: 60 },
    spinner: { width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #e65c00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
};