import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, MessageCircle, User, Inbox, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import './Messages.css';

const Messages = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // 1. Fetch from Supabase
                const { data, error } = await supabase
                    .from('messages')
                    .select('*, products(title, image_url, price)')
                    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                    .order('created_at', { ascending: false });

                const dbMessages = (data || []).map(m => ({
                    id: m.id,
                    productTitle: m.products?.title || 'Eski mahsulot',
                    productImage: m.products?.image_url,
                    productPrice: m.products?.price,
                    text: m.message_text,
                    date: new Date(m.created_at).toLocaleString(),
                    isSentByMe: m.sender_id === user.id,
                    senderName: m.sender_name,
                    receiverName: m.receiver_name
                }));

                // 2. Fetch from local storage (older messages/offline mode)
                const localMessages = JSON.parse(localStorage.getItem('sent_messages') || '[]').map(m => ({
                    ...m,
                    isSentByMe: true, // All local messages are currently sent ones
                    senderName: user.email // Current user is sender
                }));

                // 3. Combine both and sort by date
                const combined = [...dbMessages, ...localMessages].sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return dateB - dateA;
                });

                setMessages(combined);
            } catch (err) {
                console.error('Error fetching messages:', err);
                // Fallback to local only during error
                const localOnly = JSON.parse(localStorage.getItem('sent_messages') || '[]').map(m => ({ ...m, isSentByMe: true }));
                setMessages(localOnly);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [user]);

    const deleteMessage = async (id) => {
        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setMessages(messages.filter(m => m.id !== id));
        } catch (err) {
            console.error('Error deleting message:', err);
        }
    };

    if (!user) {
        return (
            <div className="messages-page">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>Xabarlarni ko'rish uchun tizimga kiring</h2>
                    <Button onClick={() => navigate('/auth')}>Kirish</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="messages-page">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> Orqaga
                </button>

                <div className="messages-header">
                    <h1>Mening Xabarlarim</h1>
                    <p>Siz yuborgan barcha xabarlar ro'yxati</p>
                </div>

                <div className="messages-list">
                    {messages.length === 0 ? (
                        <div className="no-messages">
                            <MessageCircle size={64} color="#d8dfe0" />
                            <h3>Hozircha xabarlar yo'q</h3>
                            <p>Siz hali hech kimga xabar yubormadingiz.</p>
                            <Button onClick={() => navigate('/')} variant="primary">E'lonlarni ko'rish</Button>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className="message-card">
                                <div className="message-product">
                                    <img src={msg.productImage} alt={msg.productTitle} />
                                    <div className="product-info">
                                        <h4>{msg.productTitle}</h4>
                                        <p className="price">{msg.productPrice}</p>
                                    </div>
                                </div>
                                <div className="message-content">
                                    <div className="message-meta-top">
                                        <div className={`message-status-tag ${msg.isSentByMe ? 'sent' : 'received'}`}>
                                            {msg.isSentByMe ? <Send size={14} /> : <Inbox size={14} />}
                                            <span>{msg.isSentByMe ? 'Yuborilgan' : 'Sizga kelgan'}</span>
                                        </div>
                                        <div className="message-user-info">
                                            <User size={14} />
                                            <span>
                                                {msg.isSentByMe
                                                    ? `Kimga: ${msg.receiverName || 'Sotuvchi'}`
                                                    : `Kimdan: ${msg.senderName || 'Xaridor'}`}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text">"{msg.text}"</p>
                                    <span className="date">{msg.date}</span>
                                </div>
                                <button className="delete-btn" onClick={() => deleteMessage(msg.id)}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
