import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Package, ShoppingBag, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';
import './Profile.css';

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*, products(title, price, image_url)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> Orqaga
                </button>

                <div className="profile-grid">
                    {/* User Info Card */}
                    <div className="profile-info-card">
                        <div className="profile-avatar">
                            <User size={60} />
                        </div>
                        <h2>Mening Profilim</h2>
                        <div className="info-list">
                            <div className="info-item">
                                <Mail size={18} />
                                <span>{user.email}</span>
                            </div>
                            <div className="info-item">
                                <Calendar size={18} />
                                <span>A'zo bo'lingan: {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <Button variant="outline" className="logout-btn-full" onClick={handleLogout}>
                            <LogOut size={18} /> Chiqish
                        </Button>
                    </div>

                    {/* Orders Section */}
                    <div className="profile-content">
                        <h3 className="section-subtitle">
                            <ShoppingBag size={22} /> Mening Buyurtmalarim
                        </h3>

                        {loading ? (
                            <p>Buyurtmalar yuklanmoqda...</p>
                        ) : orders.length === 0 ? (
                            <div className="no-orders">
                                <Package size={48} />
                                <p>Sizda hali hech qanday buyurtma yo'q.</p>
                                <Button onClick={() => navigate('/')}>Xaridni boshlash</Button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-id">ID: #{order.id}</div>
                                        <div className="order-details">
                                            <img
                                                src={order.products?.image_url || 'https://via.placeholder.com/100'}
                                                alt={order.products?.title}
                                            />
                                            <div className="order-info">
                                                <h4>{order.products?.title}</h4>
                                                <p className="order-price">{order.products?.price}</p>

                                                <div className="order-extra-details">
                                                    <div className="order-meta-item">
                                                        <strong>To'lov:</strong> {order.payment_method === 'karta' ? `Karta (${order.card_number || '****'})` : 'Naqd'}
                                                    </div>
                                                    <div className="order-meta-item">
                                                        <strong>Telefon:</strong> {order.phone}
                                                    </div>
                                                    <div className="order-meta-item">
                                                        <strong>Manzil:</strong> {order.address}
                                                    </div>
                                                </div>

                                                <div className="order-status-row">
                                                    <div className="order-status">
                                                        Status: <span className={`status-${order.status}`}>{order.status}</span>
                                                    </div>
                                                    <span className="order-date">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
