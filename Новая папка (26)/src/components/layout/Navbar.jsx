import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, User, MessageCircle, Menu, X, Plus, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="container navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    MARKET<span className="text-accent">PLACE</span>
                </Link>

                {/* Desktop Actions */}
                <div className="navbar-actions hidden-mobile">
                    <Link to="/messages" className="nav-link">
                        <MessageCircle size={24} />
                        <span>Xabarlar</span>
                    </Link>

                    {user ? (
                        <div className="user-nav-group">
                            <Link to="/profile" className="nav-link profile-link-nav">
                                <User size={24} />
                                <div className="user-text-nav">
                                    <span className="truncate max-w-[150px]">{user.email}</span>
                                    <span className="profile-hint">Profilim</span>
                                </div>
                            </Link>
                            <button onClick={handleSignOut} className="logout-btn-nav">
                                <LogOut size={20} />
                                <span>Chiqish</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/auth" className="nav-link font-bold">
                                Kirish
                            </Link>
                            <Link to="/auth">
                                <Button variant="outline" className="nav-btn-auth">Ro'yxatdan o'tish</Button>
                            </Link>
                        </>
                    )}

                    <Link to="/post-ad">
                        <Button variant="secondary" className="nav-btn-sell" icon={Plus}>
                            SOTISH
                        </Button>
                    </Link>
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
                    <Link to="/messages" className="mobile-link">Xabarlar</Link>
                    <Link to="/favorites" className="mobile-link">Saralanganlar</Link>
                    {user ? (
                        <>
                            <div className="mobile-link text-sm">{user.email}</div>
                            <button onClick={handleSignOut} className="mobile-link text-red-400">Chiqish</button>
                        </>
                    ) : (
                        <Link to="/auth" className="mobile-link">Kirish / Ro'yxatdan o'tish</Link>
                    )}
                    <div className="mobile-actions">
                        <Link to="/post-ad">
                            <Button variant="accent" className="w-full">E'lon berish</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
