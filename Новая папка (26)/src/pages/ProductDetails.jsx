import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Heart, MapPin, User, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const { user } = useAuth() || {};
    const { isFavorite, toggleFavorite } = useFavorites() || { isFavorite: () => false, toggleFavorite: () => { } };

    const [isPhoneVisible, setIsPhoneVisible] = React.useState(false);
    const [showChatModal, setShowChatModal] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [installmentMonths, setInstallmentMonths] = React.useState(12);

    // Order form state
    const [showOrderModal, setShowOrderModal] = React.useState(false);
    const [orderForm, setOrderForm] = React.useState({
        phone: '',
        address: '',
        paymentMethod: 'naqd',
        cardNumber: ''
    });

    React.useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, categories(name)')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    setProduct({
                        id: data.id,
                        title: data.title,
                        price: data.price,
                        location: data.location,
                        date: new Date(data.created_at).toLocaleDateString(),
                        category: data.categories?.name,
                        image: data.image_url,
                        description: data.description,
                        seller: data.seller_name,
                        sellerJoined: data.seller_joined,
                        user_id: data.user_id // ID of the seller
                    });
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Yuklanmoqda...</div>;
    }

    if (!product) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Mahsulot topilmadi</h2>
                <Button onClick={() => navigate('/')}>Bosh Sahifaga</Button>
            </div>
        );
    }

    // Extract phone number from description if possible
    const getPhoneNumber = () => {
        if (!product || !product.description) return "+998 90 123 45 67";
        const match = String(product.description).match(/Aloqa uchun:\s*(\+?[\d\s]+)/);
        return match ? match[1].trim() : "+998 90 123 45 67";
    };

    const calculateMonthly = () => {
        if (!product || !product.price) return 0;
        // Extract numbers from price string (e.g., "$950" -> 950)
        const numericPrice = parseFloat(String(product.price).replace(/[^0-9.]/g, ''));
        if (isNaN(numericPrice)) return 0;

        // Add 15% annual interest for simulation
        const totalWithInterest = numericPrice * 1.15;
        const monthly = totalWithInterest / installmentMonths;

        return Math.round(monthly).toLocaleString();
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Xabar yuborish uchun tizimga kiring.");
            navigate('/auth');
            return;
        }

        const senderPhone = user.user_metadata?.phone || "Raqam ko'rsatilmadi";

        if (message.trim()) {
            try {
                // 1. Save to Supabase (ONLY if product has a user_id)
                if (product.user_id) {
                    const { error } = await supabase
                        .from('messages')
                        .insert([
                            {
                                sender_id: user.id,
                                receiver_id: product.user_id,
                                sender_name: user.email, // Sender is current user
                                receiver_name: product.seller, // Receiver is the seller
                                product_id: product.id,
                                message_text: message
                            }
                        ]);

                    if (error) throw error;
                }

                // 2. Always save to local history for the sender
                const newMessage = {
                    id: Date.now(),
                    productTitle: product.title,
                    productImage: product.image,
                    productPrice: product.price,
                    receiverName: product.seller,
                    text: message,
                    date: new Date().toLocaleString(),
                    senderPhone: senderPhone
                };

                const existingMessages = JSON.parse(localStorage.getItem('sent_messages') || '[]');
                localStorage.setItem('sent_messages', JSON.stringify([...existingMessages, newMessage]));

                setMessage('');
                setShowChatModal(false);
                setShowSuccess(true);

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000);
            } catch (err) {
                console.error('Error sending message:', err);
                alert("Xabar yuborishda xatolik yuz berdi.");
            }
        }
    };
    const handleFinalOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Buyurtma berish uchun tizimga kiring.");
            navigate('/auth');
            return;
        }

        if (!orderForm.phone || !orderForm.address) {
            alert("Iltimos barcha maydonlarni to'ldiring.");
            return;
        }

        try {
            const { error } = await supabase
                .from('orders')
                .insert([
                    {
                        user_id: user.id,
                        product_id: product.id,
                        quantity: 1,
                        status: 'kutilmoqda',
                        payment_method: orderForm.paymentMethod,
                        phone: orderForm.phone,
                        address: orderForm.address,
                        card_number: orderForm.paymentMethod === 'karta' ? orderForm.cardNumber : null
                    }
                ]);

            if (error) throw error;

            alert("Buyurtmangiz muvaffaqiyatli qabul qilindi! Profilingizda ko'rishingiz mumkin.");
            setShowOrderModal(false);
            navigate('/profile');
        } catch (err) {
            console.error('Error creating order:', err);
            alert("Buyurtma berishda xatolik yuz berdi.");
        }
    };

    return (
        <div className="product-details-page">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> Orqaga
                </button>

                <div className="details-grid">
                    {/* Left Column: Gallery & Description */}
                    <div className="details-main-content">
                        <div className="main-image-wrapper">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="main-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=800&auto=format&fit=crop&q=60';
                                }}
                            />
                        </div>

                        <div className="info-card description-card">
                            <h3>Tavsif</h3>
                            <div className="product-meta-row">
                                <span>Joylandi: {product.date}</span>
                                <span>Kategoriya: {product.category}</span>
                            </div>
                            <p className="description-text">{product.description}</p>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="details-sidebar">
                        {/* 1. Price & Actions Card */}
                        <div className="sidebar-card summary-card">
                            <div className="sidebar-header">
                                <span className="sidebar-date">{product.date}da joylandi</span>
                                <button onClick={() => toggleFavorite(product.id)} className="action-icon-btn">
                                    <Heart size={24} fill={isFavorite(product.id) ? "red" : "none"} color={isFavorite(product.id) ? "red" : "#002f34"} />
                                </button>
                            </div>
                            <h1 className="sidebar-title">{product.title}</h1>
                            <p className="sidebar-price">{product.price}</p>

                            <div className="sidebar-actions">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full btn-message"
                                    onClick={() => setShowChatModal(true)}
                                >
                                    Xabar Yozish
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full btn-phone"
                                    onClick={() => setIsPhoneVisible(!isPhoneVisible)}
                                >
                                    {isPhoneVisible ? getPhoneNumber() : "Telefon Raqamni Ko'rsatish"}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-full btn-buy"
                                    onClick={() => setShowOrderModal(true)}
                                    style={{ marginTop: '0.5rem', background: '#3a9b6d', borderColor: '#3a9b6d' }}
                                >
                                    Buyurtma Berish
                                </Button>
                            </div>

                            {/* Installment Section */}
                            <div className="installment-card">
                                <h4 className="installment-title">Muddatli to'lov</h4>
                                <div className="installment-months">
                                    {[3, 6, 12, 24].map(m => (
                                        <button
                                            key={m}
                                            className={`month-btn ${installmentMonths === m ? 'active' : ''}`}
                                            onClick={() => setInstallmentMonths(m)}
                                        >
                                            {m} oy
                                        </button>
                                    ))}
                                </div>
                                <div className="monthly-payment">
                                    <span className="monthly-label">Oyiga:</span>
                                    <span className="monthly-price">
                                        {calculateMonthly()} {String(product?.price || '').includes('$') ? '$' : "so'm"}
                                    </span>
                                </div>
                                <p className="installment-info">Yillik ustama: 15%</p>
                            </div>
                        </div>

                        {/* 2. User Card */}
                        <div className="sidebar-card user-card">
                            <span className="card-label">FOYDALANUVCHI</span>
                            <div className="user-profile-row">
                                <div className="seller-avatar">
                                    <User size={32} />
                                </div>
                                <div className="seller-info">
                                    <p className="seller-name">{product.seller}</p>
                                    <p className="seller-joined">OLX da {product.sellerJoined} dan beri</p>
                                    <p className="seller-online">Hozir onlayn</p>
                                </div>
                            </div>
                            <button className="user-all-ads-link">
                                Muallifning barcha e'lonlari &gt;
                            </button>
                        </div>

                        {/* 3. Location Card */}
                        <div className="sidebar-card location-card">
                            <span className="card-label">MANZIL</span>
                            <div className="location-row">
                                <MapPin size={24} color="#002f34" />
                                <div>
                                    <p className="location-city">{product.location}</p>
                                    <p className="location-region">Viloyat / Shahar</p>
                                </div>
                            </div>
                            {/* Mock Map Image */}
                            <div className="map-placeholder">
                                <div className="map-pin-circle"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Modal */}
            {showChatModal && (
                <div className="modal-overlay" onClick={() => setShowChatModal(false)}>
                    <div className="chat-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{product.seller}ga xabar yuborish</h3>
                            <button className="close-modal" onClick={() => setShowChatModal(false)}>&times;</button>
                        </div>
                        <div className="chat-product-box">
                            <img
                                src={product.image}
                                alt=""
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=200&auto=format&fit=crop&q=60';
                                }}
                            />
                            <div className="chat-product-info">
                                <p className="chat-title">{product.title}</p>
                                <p className="chat-price">{product.price}</p>
                            </div>
                        </div>
                        <form className="modal-body" onSubmit={handleSendMessage}>
                            <textarea
                                placeholder="Xabaringizni yozing..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                autoFocus
                                required
                            ></textarea>
                            <div className="modal-footer">
                                <Button type="submit" variant="primary" className="w-full">YUBORISH</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* +++ NEW: Order Modal +++ */}
            {showOrderModal && (
                <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
                    <div className="chat-modal order-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Buyurtmani rasmiylashtirish</h3>
                            <button className="close-modal" onClick={() => setShowOrderModal(false)}>&times;</button>
                        </div>

                        <form className="modal-body order-form" onSubmit={handleFinalOrder}>
                            <div className="form-group-custom">
                                <label>Telefon raqamingiz:</label>
                                <input
                                    type="tel"
                                    placeholder="+998 90 123 45 67"
                                    value={orderForm.phone}
                                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group-custom">
                                <label>Yetkazib berish manzili:</label>
                                <textarea
                                    placeholder="Toshkent sh., Yunusobod tumani..."
                                    value={orderForm.address}
                                    onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group-custom">
                                <label>To'lov turi:</label>
                                <div className="payment-options">
                                    <button
                                        type="button"
                                        className={`payment-option-btn ${orderForm.paymentMethod === 'karta' ? 'active' : ''}`}
                                        onClick={() => setOrderForm({ ...orderForm, paymentMethod: 'karta' })}
                                    >
                                        Karta orqali
                                    </button>
                                    <button
                                        type="button"
                                        className={`payment-option-btn ${orderForm.paymentMethod === 'naqd' ? 'active' : ''}`}
                                        onClick={() => setOrderForm({ ...orderForm, paymentMethod: 'naqd' })}
                                    >
                                        Naqd to'lash
                                    </button>
                                </div>
                            </div>

                            {orderForm.paymentMethod === 'karta' && (
                                <div className="form-group-custom">
                                    <label>Karta raqami:</label>
                                    <input
                                        type="text"
                                        placeholder="8600 **** **** ****"
                                        value={orderForm.cardNumber}
                                        onChange={(e) => setOrderForm({ ...orderForm, cardNumber: e.target.value })}
                                        required
                                    />
                                </div>
                            )}

                            <div className="modal-footer">
                                <Button type="submit" variant="primary" className="w-full">BUYURTMA BERISH</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccess && (
                <div className="success-toast">
                    <span className="success-icon">✓</span>
                    Habaringiz yuborildi!
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
