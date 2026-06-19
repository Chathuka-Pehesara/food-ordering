
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export function AdminCustomers() {
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
