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
