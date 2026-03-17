import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import PostAd from './pages/PostAd';
import Messages from './pages/Messages';

import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="app-layout">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/post-ad" element={<PostAd />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            {/* Footer is inside specific pages or can be here if global */}
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
