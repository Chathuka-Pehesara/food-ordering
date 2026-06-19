import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const CATEGORIES = ['Pizza', 'Burger', 'Cake', 'Fried Rice', 'Kottu', 'Drinks', 'Other'];
const EMPTY = { name: '', description: '', price: '', category: 'Pizza', available: true };

export default function AdminFoods() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [image, setImage] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        try { const { data } = await api.get('/foods'); setFoods(data); }
        catch { toast.error('Failed to load foods'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditing(null); setForm(EMPTY); setImage(null); setModal(true); };
    const openEdit = (food) => { setEditing(food._id); setForm({ name: food.name, description: food.description, price: food.price, category: food.category, available: food.available }); setImage(null); setModal(true); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price) return toast.error('Name and price required');
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            if (image) fd.append('image', image);

            if (editing) { await api.put(`/foods/${editing}`, fd); toast.success('Updated!'); }
            else { await api.post('/foods', fd); toast.success('Food item added!'); }

            setModal(false);
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Save failed');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try { await api.delete(`/foods/${id}`); toast.success('Deleted'); load(); }
        catch { toast.error('Delete failed'); }
    };

    return (
        <div>
            <div style={S.header}>
                <h1 style={S.title}>Food Items</h1>
                <button onClick={openAdd} style={S.addBtn}>+ Add Food Item</button>
            </div>

            {loading ? <div style={S.center}><div style={S.spinner} /></div> : (
                <div style={S.grid}>
                    {foods.map(food => (
                        <div key={food._id} style={S.card}>
                            <img
                                src={food.image ? `http://localhost:5000${food.image}` : 'https://via.placeholder.com/280x160?text=No+Image'}
                                alt={food.name} style={S.img}
                            />
                            <div style={S.body}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <h3 style={S.name}>{food.name}</h3>
                                    <span style={{ ...S.tag, background: food.available ? '#dcfce7' : '#fee2e2', color: food.available ? '#166534' : '#991b1b' }}>
                                        {food.available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <p style={S.desc}>{food.description || '—'}</p>
                                <div style={S.footer}>
                                    <span style={S.price}>Rs. {food.price.toLocaleString()}</span>
                                    <span style={S.cat}>{food.category}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                    <button onClick={() => openEdit(food)} style={S.editBtn}>Edit</button>
                                    <button onClick={() => handleDelete(food._id)} style={S.delBtn}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal && (
                <div style={S.overlay} onClick={() => setModal(false)}>
                    <div style={S.modal} onClick={e => e.stopPropagation()}>
                        <h2 style={{ margin: '0 0 20px' }}>{editing ? 'Edit Food Item' : 'Add Food Item'}</h2>
                        <form onSubmit={handleSave}>
                            {[
                                { label: 'Name *', key: 'name', type: 'text' },
                                { label: 'Description', key: 'description', type: 'text' },
                                { label: 'Price (LKR) *', key: 'price', type: 'number' },
                            ].map(({ label, key, type }) => (
                                <div key={key} style={{ marginBottom: 14 }}>
                                    <label style={S.label}>{label}</label>
                                    <input
                                        type={type} value={form[key]}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        style={S.input}
                                    />
                                </div>
                            ))}
                            <div style={{ marginBottom: 14 }}>
                                <label style={S.label}>Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={S.input}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: 14 }}>
                                <label style={S.label}>Image</label>
                                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={S.input} />
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
                                <input type="checkbox" id="avail" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />
                                <label htmlFor="avail" style={{ fontSize: 14 }}>Available</label>
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setModal(false)} style={S.cancelBtn}>Cancel</button>
                                <button type="submit" style={S.saveBtn} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const S = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    title: { margin: 0, fontSize: 26, fontWeight: 700 },
    addBtn: { background: '#e65c00', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 },
    card: { background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
    img: { width: '100%', height: 160, objectFit: 'cover', display: 'block' },
    body: { padding: 16 },
    name: { margin: '0 0 6px', fontSize: 16, fontWeight: 700 },
    desc: { color: '#888', fontSize: 13, margin: '0 0 8px' },
    tag: { fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600 },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    price: { color: '#e65c00', fontWeight: 700, fontSize: 16 },
    cat: { background: '#f5f5f5', color: '#555', fontSize: 12, padding: '3px 10px', borderRadius: 20 },
    editBtn: { flex: 1, background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 6, padding: '8px', cursor: 'pointer', fontSize: 13 },
    delBtn: { flex: 1, background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, padding: '8px', cursor: 'pointer', fontSize: 13 },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto' },
    label: { display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 600, color: '#555' },
    input: { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
    cancelBtn: { padding: '10px 20px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer' },
    saveBtn: { padding: '10px 24px', background: '#e65c00', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' },
    center: { display: 'flex', justifyContent: 'center', padding: 60 },
    spinner: { width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #e65c00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
};