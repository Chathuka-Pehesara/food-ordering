import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrder';
import OrderConfirmation from './pages/OrderConfirmation';

import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminFoods from './pages/Admin/AdminFoods';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminCustomers from './pages/Admin/AdminCustomers';
import AdminPayments from './pages/Admin/AdminPayments';

const PrivateRoute = ({ children, adminRequired }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminRequired && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer */}
            <Route path="/" element={<><Navbar /><Menu /></>} />
            <Route path="/cart" element={<PrivateRoute><Navbar /><Cart /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Navbar /><Checkout /></PrivateRoute>} />
            <Route path="/my-orders" element={<PrivateRoute><Navbar /><MyOrders /></PrivateRoute>} />
            <Route path="/order-confirmation/:id" element={<PrivateRoute><Navbar /><OrderConfirmation /></PrivateRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<PrivateRoute adminRequired><AdminLayout /></PrivateRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="foods" element={<AdminFoods />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="payments" element={<AdminPayments />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}