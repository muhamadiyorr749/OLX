import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Heart } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/features/ProductCard';
import './Home.css';
import Footer from '../components/layout/Footer';
import { CATEGORIES, PRODUCTS_DATA } from '../data';
import { useFavorites } from '../context/FavoritesContext';
import { supabase } from '../supabaseClient';



const Home = () => {
    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [displayedProducts, setDisplayedProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const [searchQuery, setSearchQuery] = React.useState('');
    const [locationQuery, setLocationQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);

    const { isFavorite } = useFavorites();
    const navigate = useNavigate();

    // Fetch initial data
    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Categories
                const { data: categoriesData, error: catError } = await supabase
                    .from('categories')
                    .select('*')
                    .order('id');

                if (catError) throw catError;
                setCategories(categoriesData || []);

                // Fetch Products
                const { data: productsData, error: prodError } = await supabase
                    .from('products')
                    .select('*, categories(name, color, icon)')
                    .order('created_at', { ascending: false });

                if (prodError) throw prodError;

                // Map Supabase data to UI structure
                const mappedProducts = (productsData || []).map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    location: item.location,
                    date: new Date(item.created_at).toLocaleDateString(),
                    category: item.categories?.name,
                    image: item.image_url,
                    description: item.description,
                    seller: item.seller_name,
                    sellerJoined: item.seller_joined
                }));

                setProducts(mappedProducts);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products (Restored)
    React.useEffect(() => {
        let filtered = products.filter(product => {
            const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLocation = product.location?.toLowerCase().includes(locationQuery.toLowerCase());
            const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
            const matchesFavorite = showFavoritesOnly ? isFavorite(product.id) : true;

            return matchesSearch && matchesLocation && matchesCategory && matchesFavorite;
        });
        setDisplayedProducts(filtered);
    }, [searchQuery, locationQuery, selectedCategory, products, showFavoritesOnly, isFavorite]);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        // In a real app, you would verify pagination with Supabase range()
        setTimeout(() => {
            setIsLoadingMore(false);
            alert("Sahifalash tez orada!"); // Placeholder for now
        }, 800);
    };

    const handleCategoryClick = (categoryName) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(categoryName);
        }
    };

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
                                <span>{showFavoritesOnly ? "Saralanganlarni ko'rsatish" : "Saralanganlar"}</span>
                            </button>
                        </div>

                        <div className="hero-search-box">
                            <div className="search-input-group">
                                <Search className="search-icon" size={24} />
                                <input
                                    type="text"
                                    placeholder="20 dan ortiq mahsulotlarni qidirish..."
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
                                    placeholder="Joylashuv (masalan: Toshkent)"
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
                        <h2 className="section-title">Barcha Kategoriyalar</h2>
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
                            {showFavoritesOnly ? 'Sizning yoqtirganlaringiz' : (selectedCategory ? `${selectedCategory} bo'yicha tavsiyalar` : 'Yangi tavsiyalar')}
                        </h2>
                        <div className="products-grid">
                            {displayedProducts.length > 0 ? (
                                displayedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    />
                                ))
                            ) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#7f9799' }}>
                                    <h3>Mahsulot topilmadi.</h3>
                                    <p>Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring.</p>
                                </div>
                            )}
                        </div>
                        {!showFavoritesOnly && (
                            <div className="load-more-container">
                                <Button
                                    variant="outline"
                                    className="btn-load-more"
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? 'Yuklanmoqda...' : 'Ko\'proq ko\'rsatish'}
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Home;
