import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Package, ShoppingBag, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';
import './Profile.css';

const Profile = () => {
    const { user, signOut } = useAuth();
    const { t } = useLanguage();
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
                    <ArrowLeft size={20} /> {t('back')}
                </button>

                <div className="profile-grid">
                    {/* User Info Card */}
                    <div className="profile-info-card">
                        <div className="profile-avatar">
                            <User size={60} />
                        </div>
                        <h2>{t('profile_title')}</h2>
                        <div className="info-list">
                            <div className="info-item">
                                <Mail size={18} />
                                <span>{user.email}</span>
                            </div>
                            <div className="info-item">
                                <Calendar size={18} />
                                <span>{t('joined_date')}: {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <Button variant="outline" className="logout-btn-full" onClick={handleLogout}>
                            <LogOut size={18} /> {t('logout')}
                        </Button>
                    </div>

                    {/* Orders Section */}
                    <div className="profile-content">
                        <h3 className="section-subtitle">
                            <ShoppingBag size={22} /> {t('my_orders')}
                        </h3>

                        {loading ? (
                            <p>{t('loading_orders')}</p>
                        ) : orders.length === 0 ? (
                            <div className="no-orders">
                                <Package size={48} />
                                <p>{t('no_orders')}</p>
                                <Button onClick={() => navigate('/')}>{t('start_shopping')}</Button>
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
                                                        <strong>{t('payment')}:</strong> {order.payment_method === 'karta' ? `${t('card')} (${order.card_number || '****'})` : t('cash')}
                                                    </div>
                                                    <div className="order-meta-item">
                                                        <strong>{t('phone')}:</strong> {order.phone}
                                                    </div>
                                                    <div className="order-meta-item">
                                                        <strong>{t('delivery_address')}:</strong> {order.address}
                                                    </div>
                                                </div>

                                                <div className="order-status-row">
                                                    <div className="order-status">
                                                        {t('status')}: <span className={`status-${order.status}`}>{order.status}</span>
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
