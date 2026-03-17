import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import './ProductCard.css';
import { useFavorites } from '../../context/FavoritesContext';

const ProductCard = ({ product, onClick }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const liked = isFavorite && isFavorite(product.id); // Guard in case context not ready

    const handleLike = (e) => {
        e.stopPropagation(); // Prevent card click
        toggleFavorite(product.id);
    };

    const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=600&auto=format&fit=crop&q=60';

    return (
        <div className="product-card" onClick={onClick}>
            <div className="product-image-wrapper">
                <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                    }}
                />
                <button
                    className="product-favorite-btn"
                    aria-label="Add to favorites"
                    onClick={handleLike}
                >
                    <Heart size={20} fill={liked ? "red" : "none"} color={liked ? "red" : "currentColor"} />
                </button>
                {product.isFeatured && (
                    <span className="product-badge">FEATURED</span>
                )}
            </div>
            <div className="product-content">
                <div className="product-info-top">
                    <p className="product-price">{product.price}</p>
                    <h3 className="product-title">{product.title}</h3>
                </div>
                <div className="product-info-bottom">
                    <div className="product-location">
                        <MapPin size={14} />
                        <span>{product.location}</span>
                    </div>
                    <span className="product-date">{product.date}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
