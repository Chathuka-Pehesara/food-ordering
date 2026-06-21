
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Name validation
        if (!form.name.trim() || form.name.trim().length < 3) {
            return toast.error('Full name must be at least 3 characters');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
            return toast.error('Please enter a valid email address');
        }

        // Password validation
        if (form.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        // Phone validation (if provided)
        if (form.phone.trim() && !/^\+?[0-9]{9,15}$/.test(form.phone.trim())) {
            return toast.error('Please enter a valid phone number (9-15 digits)');
        }

        // Address validation
        if (!form.address.trim() || form.address.trim().length < 5) {
            return toast.error('Please enter a valid delivery address (min 5 characters)');
        }

        setLoading(true);
        try {
            await api.post('/auth/register', form);
            toast.success('Registration successful! Please sign in.');
            nav('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={S.page}>
            <div style={S.card}>
                <h2 style={S.title}>Create Account</h2>
                <p style={S.sub}>Join us and start ordering!</p>
                <form onSubmit={handleSubmit}>
                    <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
                    <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                    <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
                    <Input label="Phone (optional)" name="phone" required={false} value={form.phone} onChange={handleChange} />
                    <Input label="Address" name="address" value={form.address} onChange={handleChange} />
                    <button type="submit" style={S.btn} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>
                <p style={S.footer}>Have an account? <Link to="/login" style={S.lnk}>Sign in</Link></p>
            </div>
        </div>
    );
}

export default Register;

function Input({ label, required = true, ...props }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, color: '#555', fontWeight: 500 }}>{label}</label>
            <input required={required} style={S.input} {...props} />
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