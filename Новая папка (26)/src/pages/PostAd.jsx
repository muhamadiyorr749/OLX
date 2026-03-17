import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Image as ImageIcon, MapPin, Tag, Phone, ArrowLeft, DollarSign } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import './PostAd.css';

const PostAd = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        phone: '',
        image: '', // Selected image URL
        category_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name');
                if (error) throw error;
                setCategories(data || []);
                if (data && data.length > 0) {
                    setFormData(prev => ({ ...prev, category_id: data[0].id.toString() }));
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const SUGGESTED_IMAGES = [
        { id: 1, url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60', label: 'Telefon' },
        { id: 2, url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=60', label: 'Avto' },
        { id: 3, url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60', label: 'Mebel' },
        { id: 4, url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=60', label: 'Elektronika' },
        { id: 5, url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=60', label: 'Kitob' },
        { id: 6, url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60', label: 'Soat' }
    ];

    const handleImageSelect = (url) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent double submission
        if (loading) return;

        // Validation
        if (!formData.title || !formData.price || !formData.location || !formData.phone || !formData.image) {
            alert("Iltimos barcha maydonlarni to'ldiring va rasm tanlang");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase
                .from('products')
                .insert([
                    {
                        title: formData.title,
                        price: formData.price,
                        location: formData.location,
                        category_id: parseInt(formData.category_id),
                        image_url: formData.image,
                        description: `Aloqa uchun: ${formData.phone}`,
                        seller_name: user?.user_metadata?.first_name || user?.email || 'Foydalanuvchi',
                        seller_joined: new Date().getFullYear().toString(),
                        user_id: user?.id
                    }
                ]);

            if (error) throw error;

            // Redirect home
            navigate('/');
        } catch (error) {
            console.error('Error posting ad:', error);
            alert('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-ad-page">
            <div className="container">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    <span>Bosh Sahifaga qaytish</span>
                </Link>
                <div className="post-ad-card">
                    <div className="post-ad-header">
                        <h1>E'lon joylashtirish</h1>
                    </div>

                    <form className="post-ad-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-group">
                                <label>Post Nomi (Title)</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Mahsulot nomini kiriting"
                                    icon={Tag}
                                />
                            </div>

                            <div className="form-group">
                                <label>Narx (Price)</label>
                                <Input
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Narxini kiriting (masalan: $100.000)"
                                    type="text"
                                    icon={DollarSign}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ marginBottom: '15px', display: 'block' }}>Kategoriya Tanlang (Select Category)</label>
                                {categoriesLoading ? (
                                    <p>Kategoriyalar yuklanmoqda...</p>
                                ) : (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                                        gap: '12px',
                                        marginBottom: '20px'
                                    }}>
                                        {categories.map(cat => (
                                            <div
                                                key={cat.id}
                                                onClick={() => setFormData(prev => ({ ...prev, category_id: cat.id.toString() }))}
                                                style={{
                                                    padding: '12px 8px',
                                                    borderRadius: '12px',
                                                    border: formData.category_id === cat.id.toString() ? '2px solid #002f34' : '1px solid #d8dfe0',
                                                    backgroundColor: formData.category_id === cat.id.toString() ? '#f0f9f9' : 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s',
                                                    boxShadow: formData.category_id === cat.id.toString() ? '0 4px 12px rgba(0,47,52,0.1)' : 'none'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.8rem' }}>{cat.icon}</span>
                                                <span style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: formData.category_id === cat.id.toString() ? 'bold' : '500',
                                                    textAlign: 'center',
                                                    color: '#002f34'
                                                }}>
                                                    {cat.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Rasm Tanlang (Select Image)</label>

                                {/* URL Input */}
                                <div style={{ marginBottom: '15px' }}>
                                    <Input
                                        placeholder="Rasm Linkini (URL) bu yerga qo'ying..."
                                        icon={ImageIcon}
                                        value={formData.image}
                                        onChange={(e) => handleImageSelect(e.target.value)}
                                        name="image_url_input"
                                    />
                                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                        Internetdan rasm linkini nusxalab bu yerga qo'yishingiz mumkin.
                                    </p>
                                </div>

                                {/* File Upload */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label htmlFor="file-upload" style={{
                                        display: 'block',
                                        padding: '10px',
                                        background: '#f2f4f5',
                                        border: '2px dashed #002f34',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: '#002f34',
                                        fontWeight: 'bold'
                                    }}>
                                        📁 Kompyuterdan fayl tanlash
                                    </label>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    handleImageSelect(reader.result);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>

                                {/* Current Image Preview */}
                                {formData.image && (
                                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Tanlangan rasm ko'rinishi:</p>
                                        <div style={{
                                            width: '100%',
                                            maxHeight: '300px',
                                            overflow: 'hidden',
                                            borderRadius: '12px',
                                            border: '2px solid #23e5db',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}>
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    alert("Rasm yuklanmadi. Iltimos to'g'ri URL kiriting.");
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Yoki tayyor rasmlardan birini tanlang:</p>
                                <div className="suggested-images-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    {SUGGESTED_IMAGES.map((img) => (
                                        <div
                                            key={img.id}
                                            onClick={() => handleImageSelect(img.url)}
                                            style={{
                                                border: formData.image === img.url ? '3px solid #23e5db' : '2px solid transparent',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <img
                                                src={img.url}
                                                alt={img.label}
                                                style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                                            />
                                            <div style={{ padding: '4px', fontSize: '10px', textAlign: 'center', background: '#f0f0f0' }}>{img.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Joylashuv (Location)</label>
                                <Input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Manzilni kiriting"
                                    icon={MapPin}
                                />
                            </div>

                            <div className="form-group">
                                <label>Telefon Raqam (Phone)</label>
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+998 90 123 45 67"
                                    icon={Phone}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                                {loading ? 'Joylanmoqda...' : "E'lonni Joylash"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostAd;
