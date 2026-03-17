import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, MessageCircle, User, Inbox, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Messages.css';

const Messages = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();
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
                    productTitle: m.products?.title || t('old_product'),
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
    }, [user, t]);

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
                    <h2>{t('login_to_view_messages')}</h2>
                    <Button onClick={() => navigate('/auth')}>{t('login')}</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="messages-page">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> {t('back')}
                </button>

                <div className="messages-header">
                    <h1>{t('messages_title')}</h1>
                    <p>{t('messages_subtitle')}</p>
                </div>

                <div className="messages-list">
                    {messages.length === 0 ? (
                        <div className="no-messages">
                            <MessageCircle size={64} color="#d8dfe0" />
                            <h3>{t('no_messages')}</h3>
                            <p>{t('no_messages_subtitle')}</p>
                            <Button onClick={() => navigate('/')} variant="primary">{t('view_ads')}</Button>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className={`message-card ${msg.isSentByMe ? 'my-message' : 'other-message'}`}>
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
                                            <span>{msg.isSentByMe ? t('sent_message') : t('inbox_message')}</span>
                                        </div>
                                        <div className="message-user-info">
                                            <User size={14} />
                                            <span>
                                                {msg.isSentByMe
                                                    ? `${t('to_message')}: ${msg.receiverName}`
                                                    : `${t('from_message')}: ${msg.senderName}`}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text">"{msg.text}"</p>
                                    <span className="date">{msg.date}</span>
                                </div>
                                <button className="delete-btn" title={t('delete')} onClick={() => deleteMessage(msg.id)}>
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
