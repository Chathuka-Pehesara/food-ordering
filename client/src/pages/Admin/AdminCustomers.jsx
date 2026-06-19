
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get('/admin/customers')
            .then(({ data }) => setCustomers(data))
            .catch(() => toast.error('Failed to load customers'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div style={S.header}>
                <h1 style={S.title}>Customers</h1>
                <input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={S.searchInput}
                />
            </div>

            {loading ? <div style={S.center}><div style={S.spinner} /></div> : (
                <div style={S.tableWrap}>
                    <table style={S.table}>
                        <thead>
                            <tr>{['Name', 'Email', 'Phone', 'Address', 'Orders', 'Joined'].map(h => (
                                <th key={h} style={S.th}>{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c._id} style={S.tr}>
                                    <td style={S.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={S.avatar}>{c.name[0].toUpperCase()}</div>
                                            <span style={{ fontWeight: 600 }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={S.td}>{c.email}</td>
                                    <td style={S.td}>{c.phone || '—'}</td>
                                    <td style={S.td}><div style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address || '—'}</div></td>
                                    <td style={S.td}><span style={S.badge}>{c.orderCount} orders</span></td>
                                    <td style={S.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

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
