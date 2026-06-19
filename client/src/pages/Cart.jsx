import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cart, removeFromCart, updateQty, total, clearCart } = useCart();

    if (cart.length === 0) return (
        <div style={S.empty}>
            <p style={{ fontSize: 60 }}>🛒</p>
            <h2>Your cart is empty</h2>
            <Link to="/" style={S.shopBtn}>Browse Menu</Link>
        </div>
    );

    return (
        <div style={S.page}>
            <div style={S.container}>
                <div style={S.left}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ margin: 0 }}>Your Cart ({cart.length} items)</h2>
                        <button onClick={clearCart} style={S.clearBtn}>Clear All</button>
                    </div>

                    {cart.map(item => (
                        <div key={item._id} style={S.item}>
                            <img
                                src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/80'}
                                alt={item.name}
                                style={S.itemImg}
                            />
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: 16 }}>{item.name}</h4>
                                <p style={{ margin: 0, color: '#e65c00', fontWeight: 700 }}>Rs. {item.price.toLocaleString()}</p>
                            </div>
                            <div style={S.qtyWrap}>
                                <button style={S.qBtn} onClick={() => updateQty(item._id, item.quantity - 1)}>−</button>
                                <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                                <button style={S.qBtn} onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
                            </div>
                            <div style={{ minWidth: 90, textAlign: 'right' }}>
                                <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                <button onClick={() => removeFromCart(item._id)} style={S.removeBtn}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={S.summary}>
                    <h3 style={{ margin: '0 0 20px' }}>Order Summary</h3>
                    {cart.map(item => (
                        <div key={item._id} style={S.summaryRow}>
                            <span>{item.name} × {item.quantity}</span>
                            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                    <hr style={{ margin: '16px 0', borderColor: '#eee' }} />
                    <div style={{ ...S.summaryRow, fontWeight: 700, fontSize: 17 }}>
                        <span>Total</span>
                        <span style={{ color: '#e65c00' }}>Rs. {total.toLocaleString()}</span>
                    </div>
                    <Link to="/checkout" style={S.checkoutBtn}>Proceed to Checkout →</Link>
                </div>
            </div>
        </div>
    );
}
