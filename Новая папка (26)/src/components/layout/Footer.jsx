import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-links">
                    <div className="footer-column">
                        <h3>Ommabop Kategoriyalar</h3>
                        <ul>
                            <li><a href="#">Avtomobillar</a></li>
                            <li><a href="#">Kvartira ijarasi</a></li>
                            <li><a href="#">Mobil Telefonlar</a></li>
                            <li><a href="#">Ish o'rinlari</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Trend Qidiruvlar</h3>
                        <ul>
                            <li><a href="#">Velosipedlar</a></li>
                            <li><a href="#">Soatlar</a></li>
                            <li><a href="#">Kitoblar</a></li>
                            <li><a href="#">Itlar</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Biz Haqimizda</h3>
                        <ul>
                            <li><a href="#">EMPG haqida</a></li>
                            <li><a href="#">OLX Blog</a></li>
                            <li><a href="#">Biz bilan bo'glanish</a></li>
                            <li><a href="#">OLX Biznes uchun</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>OLX</h3>
                        <ul>
                            <li><a href="#">Yordam</a></li>
                            <li><a href="#">Sayt xaritasi</a></li>
                            <li><a href="#">Foydalanish shartlari</a></li>
                            <li><a href="#">Maxfiylik siyosati</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Marketplace. Barcha huquqlar himoyalangan.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
