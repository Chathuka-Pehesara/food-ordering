import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { count } = useCart();
    const nav = useNavigate();

    const handleLogout = () => { logout(); nav('/login'); };

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.brand}>🍔 FoodExpress</Link>

            <div style={styles.links}>
                <Link to="/" style={styles.link}>Menu</Link>

                {user ? (
                    <>
                        {user.role === 'customer' && (
                            <>
                                <Link to="/my-orders" style={styles.link}>My Orders</Link>
                                <Link to="/cart" style={styles.cartBtn}>
                                    🛒 Cart {count > 0 && <span style={styles.badge}>{count}</span>}
                                </Link>
                            </>
                        )}
                        {user.role === 'admin' && (
                            <Link to="/admin" style={styles.link}>Admin Panel</Link>
                        )}
                        <span style={styles.userName}>Hi, {user.name.split(' ')[0]}</span>
                        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.signupBtn}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
    brand: { fontSize: 22, fontWeight: 700, color: '#e65c00', textDecoration: 'none' },
    links: { display: 'flex', alignItems: 'center', gap: 16 },
    link: { color: '#333', textDecoration: 'none', fontWeight: 500 },
    cartBtn: { position: 'relative', background: '#e65c00', color: '#fff', padding: '6px 14px', borderRadius: 20, textDecoration: 'none', fontWeight: 600 },
    badge: { background: '#fff', color: '#e65c00', borderRadius: '50%', padding: '1px 6px', marginLeft: 6, fontSize: 12, fontWeight: 700 },
    userName: { color: '#555', fontSize: 14 },
    logoutBtn: { background: 'none', border: '1px solid #ccc', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', color: '#555' },
    signupBtn: { background: '#e65c00', color: '#fff', padding: '6px 16px', borderRadius: 20, textDecoration: 'none', fontWeight: 600 },
};