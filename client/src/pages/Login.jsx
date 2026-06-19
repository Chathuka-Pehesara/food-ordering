import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const nav = useNavigate();

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            login(data);
            toast.success(`Welcome back, ${data.name}!`);
            nav(data.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={S.page}>
            <div style={S.card}>
                <h2 style={S.title}>🍔 Sign In</h2>
                <p style={S.sub}>Welcome back! Order your favourites.</p>
                <form onSubmit={handleSubmit}>
                    <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                    <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
                    <button type="submit" style={S.btn} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p style={S.footer}>No account? <Link to="/register" style={S.lnk}>Register</Link></p>
            </div>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, color: '#555', fontWeight: 500 }}>{label}</label>
            <input required style={S.input} {...props} />
        </div>
    );
}

const S = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f5f0' },
    card: { background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
    title: { margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#1a1a1a' },
    sub: { margin: '0 0 24px', color: '#777', fontSize: 14 },
    input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px', background: '#e65c00', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
    footer: { marginTop: 20, textAlign: 'center', color: '#777', fontSize: 14 },
    lnk: { color: '#e65c00', fontWeight: 600, textDecoration: 'none' },
};
