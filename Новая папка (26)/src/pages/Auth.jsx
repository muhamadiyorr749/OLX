import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, User, ArrowLeft, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { signIn, signUp } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Try to sign in
                const { error: signInError } = await signIn(formData.email, formData.password);

                if (signInError) {
                    // If login fails, try to sign up automatically
                    const { data: signUpData, error: signUpError } = await signUp(formData.email, formData.password, {
                        full_name: formData.fullName || formData.email.split('@')[0],
                        phone: formData.phone
                    });

                    if (signUpError) {
                        // If sign up fails because user exists (sign up error will reflect that), 
                        // it means the password was actually wrong
                        if (signUpError.message && (signUpError.message.toLowerCase().includes('already registered') || signUpError.message.toLowerCase().includes('already exists'))) {
                            throw new Error('Noto\'g\'ri parol yoki foydalanuvchi ma\'lumotlari.');
                        }
                        throw signUpError;
                    }

                    // Sign up successful!
                    if (signUpData.session) {
                        navigate('/');
                    } else {
                        // This case happens if email confirmation is required (unlikely given user context)
                        setError("Ro'yxatdan o'tish yakunlandi! Iltimos, emailingizni tekshiring.");
                        setIsLogin(true);
                    }
                } else {
                    navigate('/');
                }
            } else {
                // Normal sign up flow
                const { data, error } = await signUp(formData.email, formData.password, {
                    full_name: formData.fullName,
                    phone: formData.phone
                });
                if (error) throw error;

                if (data.session) {
                    navigate('/');
                } else {
                    alert("Ro'yxatdan muvaffaqiyatli o'tdingiz! Endi tizimga kiring.");
                    setIsLogin(true);
                }
            }
        } catch (err) {
            // Handle specific Supabase error messages in Uzbek
            let errorMsg = err.message;
            if (errorMsg === 'Invalid login credentials') {
                errorMsg = "Noto'g'ri login yoki parol.";
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
                        <span>Back to home</span>
                    </Link>

                    <div className="auth-header">
                        <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
                        <p>{isLogin ? 'Login to manage your ads' : 'Join the marketplace community'}</p>
                    </div>

                    {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                    <form className="auth-form" onSubmit={handleAuth}>
                        {!isLogin && (
                            <>
                                <Input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    icon={User}
                                    wrapperClassName="mb-4"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number (+998 ...)"
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
                            placeholder="Email Address"
                            icon={Mail}
                            wrapperClassName="mb-4"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            icon={Lock}
                            wrapperClassName="mb-6"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <Button variant="primary" size="lg" className="w-full" disabled={loading}>
                            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                className="auth-toggle-btn"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
