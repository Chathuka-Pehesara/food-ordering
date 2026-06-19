import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const STATUSES = ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'];
const STATUS_COLORS = { pending:'#f59e0b',confirmed:'#3b82f6',preparing:'#8b5cf6',out_for_delivery:'#06b6d4',delivered:'#10b981',cancelled:'#ef4444' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const { data } = await api.get('/orders', { params });
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Status updated');
      load();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div>
      <div style={S.header}>
        <h1 style={S.title}>Orders</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={S.select}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
        </select>
      </div>

      {loading ? <div style={S.center}><div style={S.spinner}/></div> : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>{['Order ID','Customer','Contact','Items','Total','Payment','Status','Update Status'].map(h=>(
                <th key={h} style={S.th}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} style={S.tr}>
                  <td style={S.td}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td style={S.td}>
                    <div style={{ fontWeight:600 }}>{order.customer?.name}</div>
                    <div style={{ fontSize:12, color:'#888' }}>{order.customer?.email}</div>
                  </td>
                  <td style={S.td}>{order.customer?.phone || '—'}</td>
                  <td style={S.td}>
                    {order.items.map((i,idx) => (
                      <div key={idx} style={{ fontSize:13 }}>{i.name} × {i.quantity}</div>
                    ))}
                  </td>
                  <td style={S.td}>Rs. {order.totalAmount.toLocaleString()}</td>
                  <td style={S.td}>
                    <span style={{ ...S.badge, background: order.paymentStatus==='paid'?'#10b981':'#f59e0b' }}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={S.td}>
                    <span style={{ ...S.badge, background: STATUS_COLORS[order.status]||'#888' }}>
                      {order.status.replace(/_/g,' ')}
                    </span>
                  </td>
                  <td style={S.td}>
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      style={S.statusSel}
                    >
                      {STATUSES.map(s=><option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}