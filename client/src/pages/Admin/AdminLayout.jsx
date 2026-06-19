import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/orders', label: '📦 Orders' },
  { to: '/admin/foods', label: '🍕 Food Items' },
  { to: '/admin/customers', label: '👥 Customers' },
  { to: '/admin/payments', label: '💳 Payments' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div style={S.wrap}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.logo}>🍔 FoodExpress<span style={S.adminLabel}>Admin</span></div>
        <nav style={{ flex: 1 }}>
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              style={({ isActive }) => ({ ...S.navLink, ...(isActive ? S.active : {}) })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={S.sideFooter}>
          <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{user?.name}</p>
          <p style={{ margin: '0 0 12px', color: '#aaa', fontSize: 12 }}>{user?.email}</p>
          <button onClick={() => { logout(); nav('/login'); }} style={S.logoutBtn}>Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={S.main}><Outlet /></main>
    </div>
  );
}

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
