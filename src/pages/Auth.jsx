import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, User, ArrowLeft, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const { t, language, changeLanguage } = useLanguage();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { signIn, signUp, setUser } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // ADMIN BYPASS - SHOPVEX ADMIN
            if (formData.email === 'admin@shopvex.com' && formData.password === 'shopvexcom') {
                const adminUser = {
                    id: 'admin-debug-id',
                    email: 'admin@shopvex.com',
                    user_metadata: { full_name: 'Super Admin' }
                };
                localStorage.setItem('supabase_user_bypass', JSON.stringify(adminUser));
                setUser(adminUser);
                navigate('/admin');
                return;
            }

            if (isLogin) {
                const { error: signInError } = await signIn(formData.email, formData.password);
                if (signInError) throw signInError;

                // Agar admin bo'lsa to'g'ri admin panelga, bo'lmasa uyga
                if (formData.email === 'admin@shopvex.com') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            } else {
                const { data, error: signUpError } = await signUp(formData.email, formData.password, {
                    full_name: formData.fullName,
                    phone: formData.phone
                });
                if (signUpError) throw signUpError;

                if (data.user) {
                    // Create profile record for admin to see
                    await supabase.from('profiles').insert([
                        {
                            id: data.user.id,
                            email: formData.email,
                            full_name: formData.fullName || formData.email.split('@')[0],
                            role: 'user'
                        }
                    ]);
                }

                if (data.session) {
                    if (formData.email === 'admin@shopvex.com') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                } else {
                    alert(t('registration_success'));
                    setIsLogin(true);
                }
            }
        } catch (err) {
            // Handle specific Supabase error messages using translations
            let errorMsg = err.message;
            if (errorMsg === 'Invalid login credentials') {
                errorMsg = t('invalid_credentials');
            }
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Back Icon */}
                    <Link to="/" className="auth-back-link">
                        <ArrowLeft size={24} />
                        <span>{t('back_to_home')}</span>
                    </Link>

                    <div className="auth-header">
                        <h2>{isLogin ? t('welcome_back') : t('create_account')}</h2>
                        <p>{isLogin ? t('login_subtitle') : t('signup_subtitle')}</p>
                    </div>

                    {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                    <form className="auth-form" onSubmit={handleAuth}>
                        {!isLogin && (
                            <>
                                <Input
                                    type="text"
                                    name="fullName"
                                    placeholder={t('full_name')}
                                    icon={User}
                                    wrapperClassName="mb-4"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    type="tel"
                                    name="phone"
                                    placeholder={t('phone_number') + " (+998 ...)"}
                                    icon={Phone}
                                    wrapperClassName="mb-4"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </>
                        )}
                        <Input
                            type="email"
                            name="email"
                            placeholder={t('email_address')}
                            icon={Mail}
                            wrapperClassName="mb-4"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder={t('password')}
                            icon={Lock}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="input-password-toggle"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            }
                            wrapperClassName="mb-6"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <Button variant="primary" size="lg" className="w-full" disabled={loading}>
                            {loading ? t('processing') : (isLogin ? t('login') : t('register'))}
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? t('dont_have_account') + " " : t('already_have_account') + " "}
                            <button
                                className="auth-toggle-btn"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? t('register') : t('login')}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Language Switcher */}
                <div className="auth-language-selector">
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
    );
};

export default Auth;
