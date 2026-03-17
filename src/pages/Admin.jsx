import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Users, Package, MessageSquare, TrendingUp, Settings, LogOut, ChevronRight, Search, Lock, Menu, X } from 'lucide-react';
import './Admin.css';

const Admin = () => {
    const { user, signOut } = useAuth();
    const { t, language, changeLanguage } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
        revenue: '0 UZS'
    });

    const [usersList, setUsersList] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [ordersList, setOrdersList] = useState([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch products
            const { data: products, error: prodErr } = await supabase.from('products').select('*');
            if (prodErr) console.warn('Products fetch error:', prodErr.message);
            const finalProducts = products || [];
            setProductsList(finalProducts);

            // 2. Fetch orders
            const { data: orders, error: orderErr } = await supabase.from('orders').select('*, products(title, price)');
            if (orderErr) console.warn('Orders fetch error:', orderErr.message);
            const finalOrders = orders || [];
            setOrdersList(finalOrders);

            // 3. Fetch profiles
            const { data: profiles, error: profErr } = await supabase.from('profiles').select('*');
            if (profErr) console.warn('Profiles fetch error:', profErr.message);
            const finalProfiles = profiles || [];
            setUsersList(finalProfiles);

            setStats({
                users: finalProfiles.length,
                products: finalProducts.length,
                orders: finalOrders.length,
                revenue: calculateRevenue(finalOrders)
            });

        } catch (err) {
            console.error('Critical error fetching admin data:', err);
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Haqiqatdan ham ushbu mahsulotni o\'chirmoqchimisiz?')) return;

        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            setProductsList(productsList.filter(p => p.id !== id));
            alert('Mahsulot muvaffaqiyatli o\'chirildi');
        } catch (err) {
            alert('Xatolik: ' + err.message);
        }
    };

    const calculateRevenue = (orders) => {
        if (!orders) return '0 UZS';
        const total = orders.reduce((acc, order) => {
            const price = parseInt(order.products?.price?.replace(/[^0-9]/g, '') || 0);
            return acc + price;
        }, 0);
        return total.toLocaleString() + ' UZS';
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/auth');
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSidebarOpen(false); // Close sidebar on mobile after clicking
    };

    const renderDashboard = () => (
        <>
            <h1 className="admin-title">{t('dashboard')} Overview</h1>
            <div className="admin-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users"><Users /></div>
                    <div className="stat-details">
                        <h3>{stats.users}</h3>
                        <p>{t('total_users')}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon products"><Package /></div>
                    <div className="stat-details">
                        <h3>{stats.products}</h3>
                        <p>{t('total_ads')}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon messages"><MessageSquare /></div>
                    <div className="stat-details">
                        <h3>{stats.orders}</h3>
                        <p>{t('orders')}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon revenue"><TrendingUp /></div>
                    <div className="stat-details">
                        <h3>{stats.revenue}</h3>
                        <p>{t('potential_revenue')}</p>
                    </div>
                </div>
            </div>

            <div className="admin-section card">
                <div className="section-header">
                    <h2>{t('recent_orders')}</h2>
                </div>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>{t('products')}</th>
                                <th>{t('price')}</th>
                                <th>{t('payment')}</th>
                                <th>{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersList.slice(0, 5).map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.products?.title}</td>
                                    <td>{order.products?.price}</td>
                                    <td>{order.payment_method === 'karta' ? t('card') : t('cash')}</td>
                                    <td>
                                        <span className={`status-badge ${order.status === 'muvaffaqiyatli' ? 'active' : 'pending'}`}>
                                            {t(order.status === 'muvaffaqiyatli' ? 'active' : (order.status === 'yuborildi' ? 'sent' : (order.status === 'bekor qilindi' ? 'cancelled' : 'pending')))}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    const renderUsers = () => (
        <div className="admin-view">
            <h1 className="admin-title">{t('registered_users')}</h1>
            <div className="admin-section card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>{t('full_name')}</th>
                                <th>Role</th>
                                <th>{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Always show the main admin first if not in list */}
                            {!usersList.find(u => u.email === 'admin@shopvex.com') && (
                                <tr>
                                    <td>1</td>
                                    <td>admin@shopvex.com</td>
                                    <td>Super Admin</td>
                                    <td><span className="status-badge active">Admin</span></td>
                                    <td>System</td>
                                </tr>
                            )}

                            {usersList.map((usr, index) => (
                                <tr key={usr.id}>
                                    <td>{index + 2}</td>
                                    <td>{usr.email}</td>
                                    <td>{usr.full_name}</td>
                                    <td>
                                        <span className={`status-badge ${usr.role === 'admin' ? 'active' : 'pending'}`}>
                                            {usr.role === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td>{user?.id === usr.id ? 'Online (You)' : 'Registered'}</td>
                                </tr>
                            ))}

                            {usersList.length === 0 && !user && (
                                <tr><td colSpan="5" className="text-center py-4">{t('no_products')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderProducts = () => (
        <div className="admin-view">
            <div className="flex justify-between items-center mb-6">
                <h1 className="admin-title mb-0">{t('all_ads')}</h1>
                <Link to="/post-ad">
                    <button className="btn btn-accent btn-sm">{t('add_product')}</button>
                </Link>
            </div>
            <div className="admin-section card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('ad_title')}</th>
                                <th>{t('price')}</th>
                                <th>Seller</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsList.map(prod => (
                                <tr key={prod.id}>
                                    <td>{prod.id}</td>
                                    <td>{prod.title}</td>
                                    <td>{prod.price}</td>
                                    <td>
                                        <span className={`status-badge ${prod.seller_name?.includes('Admin') ? 'active' : 'pending'}`}>
                                            {prod.seller_name}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="delete-btn" onClick={() => deleteProduct(prod.id)}>{t('delete')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const updateOrderStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
            if (error) throw error;
            setOrdersList(ordersList.map(order => order.id === id ? { ...order, status: newStatus } : order));
        } catch (err) {
            alert('Xatolik: ' + err.message);
        }
    };

    const renderOrders = () => (
        <div className="admin-view">
            <h1 className="admin-title">{t('customer_orders')}</h1>
            <div className="admin-section card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('products')}</th>
                                <th>{t('price')}</th>
                                <th>Customer Info</th>
                                <th>{t('payment')}</th>
                                <th>{t('status')}</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersList.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4">{t('no_orders')}</td></tr>
                            ) : (
                                ordersList.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.products?.title}</td>
                                        <td>{order.products?.price}</td>
                                        <td>
                                            <div className="flex flex-col text-xs">
                                                <span className="font-bold">{order.phone}</span>
                                                <span className="text-gray-500">{order.address}</span>
                                            </div>
                                        </td>
                                        <td>{order.payment_method === 'karta' ? t('card') : t('cash')}</td>
                                        <td>
                                            <span className={`status-badge ${order.status === 'muvaffaqiyatli' ? 'active' : 'pending'}`}>
                                                {t(order.status === 'muvaffaqiyatli' ? 'active' : (order.status === 'yuborildi' ? 'sent' : (order.status === 'bekor qilindi' ? 'cancelled' : 'pending')))}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="text-xs p-1 border rounded"
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            >
                                                <option value="kutilmoqda">{t('pending')}</option>
                                                <option value="yuborildi">{t('sent')}</option>
                                                <option value="muvaffaqiyatli">{t('active')}</option>
                                                <option value="bekor qilindi">{t('cancelled')}</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const [siteSettings, setSiteSettings] = useState({
        siteName: 'SHOPVEX',
        supportEmail: 'support@shopvex.uz'
    });

    const saveSettings = () => {
        alert("Sozlamalar muvaffaqiyatli saqlandi!");
        // Bu yerda localStorage yoki DB ga saqlash mumkin
    };

    const renderSettings = () => (
        <div className="admin-view">
            <h1 className="admin-title">{t('admin_settings')}</h1>
            <div className="admin-settings-container">
                <div className="admin-section card">
                    <div className="section-header">
                        <div className="flex items-center gap-2">
                            <Settings className="text-secondary" size={20} />
                            <h2>{t('site_config')}</h2>
                        </div>
                    </div>
                    <div className="settings-form">
                        <div className="input-group">
                            <label>{t('site_name')}</label>
                            <input
                                type="text"
                                value={siteSettings.siteName}
                                onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                                placeholder="Enter site name"
                            />
                            <p className="input-hint">{t('site_name')} hint...</p>
                        </div>
                        <div className="input-group">
                            <label>{t('support_email')}</label>
                            <input
                                type="email"
                                value={siteSettings.supportEmail}
                                onChange={(e) => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="admin-section card mt-6">
                    <div className="section-header">
                        <div className="flex items-center gap-2">
                            <Lock className="text-secondary" size={20} />
                            <h2>{t('security_account')}</h2>
                        </div>
                    </div>
                    <div className="settings-form">
                        <div className="input-group">
                            <label>Admin Email</label>
                            <input type="email" defaultValue="admin@shopvex.com" disabled />
                        </div>
                        <div className="input-group">
                            <label>{t('update_password')}</label>
                            <input type="password" placeholder="••••••••" />
                            <p className="input-hint">Xavfsizlik uchun kamida 8 ta belgidan foydalaning.</p>
                        </div>
                        <div className="form-actions mt-4 text-center">
                            <button className="btn btn-accent px-8" onClick={saveSettings}>{t('save_changes')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) return <div className="admin-loading">{t('loading')}</div>;

        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'users': return renderUsers();
            case 'products': return renderProducts();
            case 'support': return renderOrders();
            case 'settings': return renderSettings();
            default: return renderDashboard();
        }
    };

    return (
        <div className="admin-page">
            {/* Mobile Header Toggle */}
            <div className="admin-mobile-header">
                <div className="admin-logo">
                    ADMIN<span>PANEL</span>
                </div>
                <button className="admin-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-logo desktop-logo">
                    ADMIN<span>PANEL</span>
                </div>
                <nav className="admin-nav">
                    <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabClick('dashboard')}>
                        <TrendingUp size={20} /> {t('dashboard')}
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => handleTabClick('users')}>
                        <Users size={20} /> {t('users')}
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => handleTabClick('products')}>
                        <Package size={20} /> {t('products')}
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'support' ? 'active' : ''}`} onClick={() => handleTabClick('support')}>
                        <MessageSquare size={20} /> {t('orders')}
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => handleTabClick('settings')}>
                        <Settings size={20} /> {t('settings')}
                    </button>
                </nav>
                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <LogOut size={18} /> {t('exit')}
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="admin-search">
                        <Search size={20} />
                        <input type="text" placeholder={`${t('search_placeholder')}...`} />
                    </div>
                    <div className="admin-header-actions">
                        <div className="admin-lang-selector">
                            <button 
                                className={`lang-btn ${language === 'uz' ? 'active' : ''}`} 
                                onClick={() => changeLanguage('uz')}
                            >
                                UZ
                            </button>
                            <button 
                                className={`lang-btn ${language === 'ru' ? 'active' : ''}`} 
                                onClick={() => changeLanguage('ru')}
                            >
                                RU
                            </button>
                            <button 
                                className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
                                onClick={() => changeLanguage('en')}
                            >
                                EN
                            </button>
                        </div>
                        <div className="admin-user-profile">
                            <div className="admin-avatar">{user?.email?.[0].toUpperCase() || 'A'}</div>
                            <div className="admin-user-info">
                                <span className="admin-name">{user?.email?.split('@')[0] || 'Admin User'}</span>
                                <span className="admin-role">{user?.email === 'admin@shopvex.com' ? 'Super Admin' : 'Testing User'}</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Admin;
