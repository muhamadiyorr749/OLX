import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, User, MessageCircle, Menu, X, Plus, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import logo from '../../assets/images/logo.png';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="container navbar-container">
                {/* Logo with Image and Text */}
                <Link to={user ? "/home" : "/auth"} className="navbar-logo-container">
                    <img src={logo} alt="Shopvex Logo" className="navbar-logo-img" />
                    <span className="navbar-logo-text">
                        SHOP<span className="text-secondary-logo">VEX</span>
                    </span>
                </Link>

                {/* Desktop Actions */}
                <div className="navbar-actions hidden-mobile">
                    <Link to="/messages" className="nav-link">
                        <MessageCircle size={24} />
                        <span>{t('messages')}</span>
                    </Link>

                    {user ? (
                        <div className="user-nav-group">
                            <Link to="/profile" className="nav-link profile-link-nav">
                                <User size={24} />
                                <div className="user-text-nav">
                                    <span className="truncate max-w-[150px]">{user.email}</span>
                                    <span className="profile-hint">{t('profile_hint')}</span>
                                </div>
                            </Link>
                            <button onClick={handleSignOut} className="logout-btn-nav">
                                <LogOut size={20} />
                                <span>{t('logout')}</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/auth" className="nav-link font-bold">
                                {t('login')}
                            </Link>
                            <Link to="/auth">
                                <Button variant="outline" className="nav-btn-auth">{t('register')}</Button>
                            </Link>
                        </>
                    )}

                    {user && (
                        <>
                            {user.email === 'admin@shopvex.com' && (
                                <Link to="/admin" className="nav-link text-accent font-bold">
                                    {t('admin_panel')}
                                </Link>
                            )}
                            <Link to="/post-ad">
                                <Button variant="secondary" className="nav-btn-sell" icon={Plus}>
                                    {t('sell')}
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <Link to="/messages" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t('messages')}</Link>
                    <Link to="/favorites" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t('favorites')}</Link>
                    {user ? (
                        <>
                            <Link to="/profile" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                                {t('my_profile')} ({user.email})
                            </Link>
                            {user.email === 'admin@shopvex.com' && (
                                <Link to="/admin" className="mobile-link text-accent" onClick={() => setIsMenuOpen(false)}>
                                    {t('admin_panel')}
                                </Link>
                            )}
                            <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="mobile-link text-red-400">{t('logout')}</button>
                        </>
                    ) : (
                        <Link to="/auth" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t('login')} / {t('register')}</Link>
                    )}
                    <div className="mobile-actions">
                        <Link to="/post-ad" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="accent" className="w-full">{t('post_ad_btn')}</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
