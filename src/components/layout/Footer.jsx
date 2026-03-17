import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
    const { t, language, changeLanguage } = useLanguage();
    const navigate = useNavigate();

    const handleCategoryLink = (category) => {
        navigate(`/home?category=${encodeURIComponent(category)}`);
    };

    const handleSearchLink = (query) => {
        navigate(`/home?search=${encodeURIComponent(query)}`);
    };

    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-links">
                    <div className="footer-column">
                        <h3>{t('popular_categories')}</h3>
                        <ul>
                            <li><button className="footer-link-btn" onClick={() => handleCategoryLink('Avtomobillar')}>Avtomobillar</button></li>
                            <li><button className="footer-link-btn" onClick={() => handleCategoryLink('Ko\'chmas mulk')}>Kvartira ijarasi</button></li>
                            <li><button className="footer-link-btn" onClick={() => handleCategoryLink('Elektronika')}>Mobil Telefonlar</button></li>
                            <li><button className="footer-link-btn" onClick={() => handleCategoryLink('Ish')}>Ish o'rinlari</button></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>{t('trend_searches')}</h3>
                        <ul>
                            <li><button className="footer-link-btn" onClick={() => handleSearchLink('velosiped')}>Velosipedlar</button></li>
                            <li><button className="footer-link-btn" onClick={() => handleSearchLink('soat')}>Soatlar</button></li>
                            <li><button className="footer-link-btn" onClick={() => handleSearchLink('kitob')}>Kitoblar</button></li>
                            <li><button className="footer-link-btn" onClick={() => handleSearchLink('it')}>Itlar</button></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>{t('about_us')}</h3>
                        <ul>
                            <li><a className="footer-link-btn" href="mailto:info@shopvex.uz">SHOPVEX haqida</a></li>
                            <li><a className="footer-link-btn" href="https://t.me/shopvex" target="_blank" rel="noreferrer">SHOPVEX Blog</a></li>
                            <li><a className="footer-link-btn" href="mailto:support@shopvex.uz">Biz bilan bog'lanish</a></li>
                            <li><a className="footer-link-btn" href="mailto:business@shopvex.uz">SHOPVEX Biznes uchun</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>SHOPVEX</h3>
                        <ul>
                            <li><a className="footer-link-btn" href="mailto:support@shopvex.uz">{t('help')}</a></li>
                            <li><Link className="footer-link-btn" to="/home">Sayt xaritasi</Link></li>
                            <li><a className="footer-link-btn" href="#">Foydalanish shartlari</a></li>
                            <li><a className="footer-link-btn" href="#">Maxfiylik siyosati</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 SHOPVEX. {t('all_rights_reserved')}.</p>
                    <div className="language-selector">
                        <button 
                            className={`lang-btn ${language === 'uz' ? 'active' : ''}`} 
                            onClick={() => changeLanguage('uz')}
                        >
                            O'zbekcha
                        </button>
                        <button 
                            className={`lang-btn ${language === 'ru' ? 'active' : ''}`} 
                            onClick={() => changeLanguage('ru')}
                        >
                            Русский
                        </button>
                        <button 
                            className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
                            onClick={() => changeLanguage('en')}
                        >
                            English
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
