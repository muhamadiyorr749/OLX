import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Heart } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/features/ProductCard';
import './Home.css';
import Footer from '../components/layout/Footer';
import { CATEGORIES, PRODUCTS_DATA } from '../data';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';



const Home = () => {
    const { t } = useLanguage();
    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [displayedProducts, setDisplayedProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const [searchQuery, setSearchQuery] = React.useState(params.get('search') || '');
    const [locationQuery, setLocationQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState(params.get('category') || null);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);

    const { isFavorite } = useFavorites();
    const navigate = useNavigate();

    // Fetch initial data
    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch Categories
                const { data: categoriesData, error: catError } = await supabase
                    .from('categories')
                    .select('*')
                    .order('id');

                if (catError) {
                    console.error('Kategoriyalarni yuklashda xato:', catError);
                    // Agar kategoriya bo'lmasa, bo'sh massiv qo'yamiz
                    setCategories([]);
                } else {
                    setCategories(categoriesData || []);
                }

                // 2. Fetch Products
                const { data: productsData, error: prodError } = await supabase
                    .from('products')
                    .select('*, categories(name, color, icon)')
                    .order('created_at', { ascending: false });

                if (prodError) throw prodError;

                if (!productsData || productsData.length === 0) {
                    console.warn("Bazadan mahsulot topilmadi");
                    setProducts([]);
                } else {
                    // Map Supabase data to UI structure
                    const mappedProducts = productsData.map(item => ({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        location: item.location,
                        date: new Date(item.created_at).toLocaleDateString(),
                        category: item.categories?.name || 'Kategoriyasiz',
                        image: item.image_url,
                        description: item.description,
                        seller: item.seller_name,
                        sellerJoined: item.seller_joined
                    }));
                    setProducts(mappedProducts);
                }

            } catch (err) {
                console.error('Ma\'lumotlarni yuklashda xatolik:', err);
                setError("Ma'lumotlarni yuklab bo'lmadi. Iltimos, internetingizni tekshiring va sahifani yangilang.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Memoized filtered products for better performance
    const filteredProducts = React.useMemo(() => {
        return products.filter(product => {
            const matchesSearch = !searchQuery ||
                product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesLocation = !locationQuery ||
                product.location?.toLowerCase().includes(locationQuery.toLowerCase());

            const matchesCategory = !selectedCategory ||
                product.category === selectedCategory;

            const matchesFavorite = !showFavoritesOnly ||
                isFavorite(product.id);

            return matchesSearch && matchesLocation && matchesCategory && matchesFavorite;
        });
    }, [searchQuery, locationQuery, selectedCategory, products, showFavoritesOnly, isFavorite]);

    const handleCategoryClick = React.useCallback((categoryName) => {
        setSelectedCategory(prev => prev === categoryName ? null : categoryName);
    }, []);

    return (
        <>
            <div className="home-page">
                {/* Search Hero */}
                <div className="hero-section">
                    <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>

                        {/* Favorites Filter Toggle - "Space at the top" */}
                        <div className="favorites-filter-area">
                            <button
                                className={`fav-filter-btn ${showFavoritesOnly ? 'active' : ''}`}
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            >
                                <Heart size={20} fill={showFavoritesOnly ? "red" : "none"} color={showFavoritesOnly ? "red" : "currentColor"} />
                                <span>{showFavoritesOnly ? t('show_favorites') : t('favorites')}</span>
                            </button>
                        </div>

                        <div className="hero-search-box">
                            <div className="search-input-group">
                                <Search className="search-icon" size={24} />
                                <input
                                    type="text"
                                    placeholder={t('search_placeholder')}
                                    className="hero-input main-search"
                                    style={{ width: '100%' }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="divider"></div>
                            {/* Location Input - No Search Icon, Interactive */}
                            <div className="search-input-group location-group" style={{ position: 'relative' }}>
                                <MapPin className="search-icon" size={24} />
                                <input
                                    type="text"
                                    placeholder={t('location_placeholder')}
                                    className="hero-input location-search"
                                    value={locationQuery}
                                    onChange={(e) => setLocationQuery(e.target.value)}
                                />
                            </div>
                            {/* REMOVED BIG SEARCH BUTTON AS REQUESTED */}
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <section className="section-categories">
                    <div className="container">
                        <h2 className="section-title">{t('all_categories')}</h2>
                        <div className="categories-grid">
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    className={`category-item ${selectedCategory === cat.name ? 'active-category' : ''}`}
                                    onClick={() => handleCategoryClick(cat.name)}
                                >
                                    <div
                                        className="category-icon-circle"
                                        style={{
                                            backgroundColor: selectedCategory === cat.name ? cat.color : cat.color + '20',
                                            color: selectedCategory === cat.name ? '#fff' : cat.color
                                        }}
                                    >
                                        <div style={{ fontSize: '1.5rem' }}>{cat.icon}</div>
                                    </div>
                                    <span className="category-name" style={{ fontWeight: selectedCategory === cat.name ? 'bold' : 'normal' }}>
                                        {cat.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Fresh Recommendations */}
                <section className="section-products">
                    <div className="container">
                        <h2 className="section-title">
                            {showFavoritesOnly ? t('favorites_title') : (selectedCategory ? `${selectedCategory}` : t('recommendations'))}
                        </h2>
                        <div className="products-grid">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    />
                                ))
                            ) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#7f9799' }}>
                                    <h3>{t('no_products')}</h3>
                                    <p>{t('search_change_filter')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Home;
