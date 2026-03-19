import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '6rem', color: '#002f34', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ marginBottom: '2rem' }}>Sahifa topilmadi</h2>
            <p style={{ color: '#7f9799', marginBottom: '2rem', maxWidth: '400px' }}>
                Siz so'ragan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan bo'lishi mumkin.
            </p>
            <Button 
                variant="primary" 
                size="lg" 
                icon={Home} 
                onClick={() => navigate('/')}
            >
                Bosh sahifaga qaytish
            </Button>
        </div>
    );
};

export default NotFound;
