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
