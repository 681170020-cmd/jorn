import { useState, useRef, useEffect } from 'react';

const MessageCircleIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
);

const Chat = ({ user, onLoginClick }) => {
    // Earth Tone Colors
    const colors = {
        bg: '#fdfaf6',
        cardBg: '#ffffff',
        primary: '#8b5e3c',
        textMain: '#3d2b1f',
        textSecondary: '#8d7b6d',
        border: 'rgba(139, 94, 60, 0.15)',
        messageBg: 'rgba(139, 94, 60, 0.08)',
        myMessageBg: '#8b5e3c',
        overlay: 'rgba(61, 43, 31, 0.4)'
    };

    // Sample conversations
    const [conversations, setConversations] = useState([
        {
            id: 1,
            name: 'แม่นุ่น',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800',
            lastMessage: 'น้องโมจิยังหาบ้านอยู่ไหมคะ?',
            unread: 2,
            messages: [
                { id: 1, sender: 'แม่นุ่น', text: 'สวัสดีค่ะ', time: '10:30' },
                { id: 2, sender: 'แม่นุ่น', text: 'น้องโมจิยังหาบ้านอยู่ไหมคะ?', time: '10:31' }
            ]
        },
        {
            id: 2,
            name: 'กอล์ฟ',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
            lastMessage: 'ขอบคุณครับ!',
            unread: 0,
            messages: [
                { id: 1, sender: 'me', text: 'สนใจน้องไทเกอร์ครับ', time: '09:00' },
                { id: 2, sender: 'กอล์ฟ', text: 'ได้ครับ นัดเจอกันได้เลย', time: '09:15' },
                { id: 3, sender: 'me', text: 'เย็นนี้ว่างไหมครับ?', time: '09:20' },
                { id: 4, sender: 'กอล์ฟ', text: 'ขอบคุณครับ!', time: '09:25' }
            ]
        }
    ]);

    const [selectedConv, setSelectedConv] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConv?.messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConv) return;

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const updatedConversations = conversations.map(conv => {
            if (conv.id === selectedConv.id) {
                return {
                    ...conv,
                    messages: [...conv.messages, {
                        id: Date.now(),
                        sender: 'me',
                        text: newMessage,
                        time: timeStr
                    }],
                    lastMessage: newMessage
                };
            }
            return conv;
        });

        setConversations(updatedConversations);
        setSelectedConv(updatedConversations.find(c => c.id === selectedConv.id));
        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const styles = {
        container: {
            padding: '120px 2rem 2rem',
            backgroundColor: colors.bg,
            minHeight: '100vh',
            fontFamily: "'Outfit', sans-serif"
        },
        chatContainer: {
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '350px 1fr',
            gap: '1.5rem',
            height: 'calc(100vh - 160px)',
            backgroundColor: colors.cardBg,
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            border: `1px solid ${colors.border}`
        },
        sidebar: {
            borderRight: `1px solid ${colors.border}`,
            display: 'flex',
            flexDirection: 'column'
        },
        sidebarHeader: {
            padding: '1.5rem',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        sidebarTitle: {
            fontSize: '1.5rem',
            fontWeight: '800',
            color: colors.textMain,
            margin: 0
        },
        conversationsList: {
            flex: 1,
            overflowY: 'auto',
            padding: '0.5rem'
        },
        conversationItem: (isSelected) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            cursor: 'pointer',
            backgroundColor: isSelected ? colors.messageBg : 'transparent',
            transition: 'all 0.2s ease',
            marginBottom: '0.5rem'
        }),
        avatar: {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${colors.border}`
        },
        avatarPlaceholder: {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '1.2rem'
        },
        convInfo: {
            flex: 1,
            minWidth: 0
        },
        convName: {
            fontWeight: '700',
            color: colors.textMain,
            marginBottom: '4px'
        },
        convLastMessage: {
            fontSize: '0.9rem',
            color: colors.textSecondary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        unreadBadge: {
            backgroundColor: colors.primary,
            color: 'white',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: '700'
        },
        chatArea: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#faf8f5'
        },
        chatHeader: {
            padding: '1.5rem',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: colors.cardBg
        },
        chatHeaderName: {
            fontWeight: '700',
            fontSize: '1.1rem',
            color: colors.textMain
        },
        messagesArea: {
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        },
        messageRow: (isMe) => ({
            display: 'flex',
            justifyContent: isMe ? 'flex-end' : 'flex-start'
        }),
        messageBubble: (isMe) => ({
            maxWidth: '70%',
            padding: '0.8rem 1.2rem',
            borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
            backgroundColor: isMe ? colors.myMessageBg : colors.cardBg,
            color: isMe ? 'white' : colors.textMain,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }),
        messageText: {
            fontSize: '0.95rem',
            lineHeight: '1.5',
            marginBottom: '4px'
        },
        messageTime: (isMe) => ({
            fontSize: '0.75rem',
            color: isMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
            textAlign: 'right'
        }),
        inputArea: {
            padding: '1rem 1.5rem',
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            backgroundColor: colors.cardBg
        },
        input: {
            flex: 1,
            padding: '0.8rem 1.2rem',
            borderRadius: '24px',
            border: `1px solid ${colors.border}`,
            fontSize: '1rem',
            outline: 'none',
            fontFamily: "'Outfit', sans-serif",
            backgroundColor: '#faf8f5'
        },
        sendBtn: {
            backgroundColor: colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'all 0.2s ease'
        },
        emptyState: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textSecondary,
            gap: '1rem'
        },
        emptyIcon: {
            fontSize: '4rem',
            opacity: 0.5
        },
        loginPrompt: {
            textAlign: 'center',
            padding: '3rem',
            color: colors.textSecondary
        },
        loginBtn: {
            marginTop: '1rem',
            padding: '0.8rem 2rem',
            backgroundColor: colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
        }
    };

    // If not logged in
    if (!user) {
        return (
            <div style={styles.container}>
                <div style={styles.chatContainer}>
                    <div style={styles.loginPrompt}>
                        <div style={{ marginBottom: '1rem', color: colors.primary }}>
                            <MessageCircleIcon size={48} />
                        </div>
                        <h2 style={{ color: colors.textMain, marginBottom: '0.5rem' }}>เข้าสู่ระบบเพื่อใช้งานแชท</h2>
                        <p>กรุณาเข้าสู่ระบบเพื่อพูดคุยกับผู้ใช้คนอื่น</p>
                        <button style={styles.loginBtn} onClick={onLoginClick}>เข้าสู่ระบบ</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.chatContainer}>
                {/* Sidebar - Conversations List */}
                <div style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>
                        <h2 style={styles.sidebarTitle}>
                            <MessageCircleIcon size={24} color={colors.primary} />
                            แชท
                        </h2>
                    </div>
                    <div style={styles.conversationsList}>
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                style={styles.conversationItem(selectedConv?.id === conv.id)}
                                onClick={() => {
                                    setSelectedConv(conv);
                                    // Mark as read
                                    setConversations(conversations.map(c =>
                                        c.id === conv.id ? { ...c, unread: 0 } : c
                                    ));
                                }}
                                onMouseOver={(e) => {
                                    if (selectedConv?.id !== conv.id) {
                                        e.currentTarget.style.backgroundColor = 'rgba(139, 94, 60, 0.04)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (selectedConv?.id !== conv.id) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                {conv.avatar ? (
                                    <img src={conv.avatar} alt={conv.name} style={styles.avatar} />
                                ) : (
                                    <div style={styles.avatarPlaceholder}>{conv.name.charAt(0)}</div>
                                )}
                                <div style={styles.convInfo}>
                                    <div style={styles.convName}>{conv.name}</div>
                                    <div style={styles.convLastMessage}>{conv.lastMessage}</div>
                                </div>
                                {conv.unread > 0 && (
                                    <div style={styles.unreadBadge}>{conv.unread}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={styles.chatArea}>
                    {selectedConv ? (
                        <>
                            {/* Chat Header */}
                            <div style={styles.chatHeader}>
                                {selectedConv.avatar ? (
                                    <img src={selectedConv.avatar} alt={selectedConv.name} style={{ ...styles.avatar, width: '40px', height: '40px' }} />
                                ) : (
                                    <div style={{ ...styles.avatarPlaceholder, width: '40px', height: '40px', fontSize: '1rem' }}>{selectedConv.name.charAt(0)}</div>
                                )}
                                <span style={styles.chatHeaderName}>{selectedConv.name}</span>
                            </div>

                            {/* Messages */}
                            <div style={styles.messagesArea}>
                                {selectedConv.messages.map(msg => {
                                    const isMe = msg.sender === 'me';
                                    return (
                                        <div key={msg.id} style={styles.messageRow(isMe)}>
                                            <div style={styles.messageBubble(isMe)}>
                                                <div style={styles.messageText}>{msg.text}</div>
                                                <div style={styles.messageTime(isMe)}>{msg.time}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div style={styles.inputArea}>
                                <input
                                    style={styles.input}
                                    placeholder="พิมพ์ข้อความ..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    onFocus={(e) => e.target.style.borderColor = colors.primary}
                                    onBlur={(e) => e.target.style.borderColor = colors.border}
                                />
                                <button
                                    style={styles.sendBtn}
                                    onClick={handleSendMessage}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    ➤
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={styles.emptyState}>
                            <span style={styles.emptyIcon}>
                                <MessageCircleIcon size={48} color={colors.primary} />
                            </span>
                            <p>เลือกการสนทนาเพื่อเริ่มแชท</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
