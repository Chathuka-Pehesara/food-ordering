import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Cake', 'Fried Rice', 'Kottu', 'Drinks', 'Other'];

export default function Menu() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchFoods = async () => {
            setLoading(true);
            try {
                const params = {};
                if (category !== 'All') params.category = category;
                if (search) params.search = search;
                const { data } = await api.get('/foods', { params });
                setFoods(data);
            } catch {
                toast.error('Failed to load menu');
            } finally {
                setLoading(false);
            }
        };
        const t = setTimeout(fetchFoods, 300); // debounce search
        return () => clearTimeout(t);
    }, [category, search]);

    return (
        <div style={S.page}>
            {/* Hero */}
            <div style={S.hero}>
                <h1 style={S.heroTitle}>Delicious Food,<br />Delivered Fast 🚀</h1>
                <input
                    placeholder="Search pizza, burger..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={S.searchBar}
                />
            </div>

            <div style={S.container}>
                {/* Category filters */}
                <div style={S.cats}>
                    {CATEGORIES.map(c => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            style={{ ...S.catBtn, ...(category === c ? S.catActive : {}) }}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={S.center}><div style={S.spinner} /></div>
                ) : foods.length === 0 ? (
                    <div style={S.center}><p style={{ color: '#999' }}>No items found.</p></div>
                ) : (
                    <div style={S.grid}>
                        {foods.filter(f => f.available).map(food => (
                            <FoodCard key={food._id} food={food} onAdd={() => { addToCart(food); toast.success(`${food.name} added to cart!`); }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function FoodCard({ food, onAdd }) {
    return (
        <div style={S.card}>
            <div style={S.imgWrap}>
                <img
                    src={food.image ? `http://localhost:5000${food.image}` : 'https://via.placeholder.com/300x200?text=Food'}
                    alt={food.name}
                    style={S.img}
                />
                <span style={S.catTag}>{food.category}</span>
            </div>
            <div style={S.cardBody}>
                <h3 style={S.foodName}>{food.name}</h3>
                <p style={S.desc}>{food.description || 'Freshly prepared just for you.'}</p>
                <div style={S.footer}>
                    <span style={S.price}>Rs. {food.price.toLocaleString()}</span>
                    <button onClick={onAdd} style={S.addBtn}>+ Add</button>
                </div>
            </div>
        </div>
    );
}

const S = {
    page: { background: '#f9f5f0', minHeight: '100vh' },
    hero: { background: 'linear-gradient(135deg,#e65c00,#f9d423)', padding: '60px 24px', textAlign: 'center' },
    heroTitle: { color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 24px' },
    searchBar: { width: '100%', maxWidth: 480, padding: '14px 20px', borderRadius: 40, border: 'none', fontSize: 16, outline: 'none' },
    container: { maxWidth: 1200, margin: '0 auto', padding: '24px 16px' },
    cats: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 },
    catBtn: { padding: '8px 18px', borderRadius: 20, border: '2px solid #e65c00', background: '#fff', color: '#e65c00', fontWeight: 600, cursor: 'pointer' },
    catActive: { background: '#e65c00', color: '#fff' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 },
    card: { background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', transition: 'transform 0.2s', cursor: 'default' },
    imgWrap: { position: 'relative' },
    img: { width: '100%', height: 180, objectFit: 'cover', display: 'block' },
    catTag: { position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 20 },
    cardBody: { padding: '14px 16px 16px' },
    foodName: { margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: '#1a1a1a' },
    desc: { color: '#888', fontSize: 13, margin: '0 0 12px', lineHeight: 1.5 },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    price: { fontSize: 17, fontWeight: 700, color: '#e65c00' },
    addBtn: { background: '#e65c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
    center: { display: 'flex', justifyContent: 'center', padding: 60 },
    spinner: { width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #e65c00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
};