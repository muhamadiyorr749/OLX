import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import PostAd from './pages/PostAd';
import Messages from './pages/Messages';

import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider } from './context/LanguageContext';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

// Sahifalar o'zgarganida yuqoriga qaytarish
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Himoyalangan Marshrut: Agar foydalanuvchi kirmagan bo'lsa, Auth sahifasiga yuboradi
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;

  return children;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <ScrollToTop />
            <div className="app-layout">
              <Navbar />
              <main>
                <Routes>
                  {/* Saytga kirganda birinchi Auth sahifasi chiqsin */}
                  <Route path="/" element={<Navigate to="/home" />} />
                  <Route path="/auth" element={<Auth />} />
  
                  {/* Qolgan sahifalar faqat kirganlar uchun */}
                  <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/post-ad" element={<ProtectedRoute><PostAd /></ProtectedRoute>} />
                  <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                </Routes>
              </main>
            </div>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
