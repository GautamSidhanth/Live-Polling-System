import React, { useState, useEffect } from 'react';
import styles from './ChatWidget.module.css';
import { useSocket } from '../../context/SocketContext';

interface Message {
  id: string;
  sender: string;
  text: string;
  isOwn: boolean;
}

interface ChatWidgetProps {
  userRole?: 'student' | 'teacher';
  userName?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ userRole, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket } = useSocket();
  
  // Get current user info from props or localStorage
  const myName = userName || localStorage.getItem('studentName') || 'Teacher'; 
  
  // Determine if teacher from props or URL
  const isTeacher = userRole === 'teacher' || window.location.pathname.includes('teacher');
  const displayName = isTeacher ? 'Teacher' : myName;

  // State for participants
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Request current participants
    socket.emit('request:participants');

    socket.on('participants:update', (updatedList: string[]) => {
        setParticipants(updatedList);
    });

    socket.on('chat:receive', (msg: any) => {
        setMessages(prev => [...prev, {
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            isOwn: msg.sender === displayName
        }]);
    });
    
    return () => {
        socket.off('chat:receive');
        socket.off('participants:update');
    };
  }, [socket, displayName]);

  const handleSend = () => {
    if (!message.trim() || !socket) return;
    
    socket.emit('chat:send', {
        sender: displayName,
        text: message
    });
    
    setMessage('');
  };

  const handleKick = (name: string) => {
    if (!socket) return;
    if (window.confirm(`Are you sure you want to kick ${name}?`)) {
        socket.emit('student:kick', name);
    }
  };

  return (
    <>
      <button className={styles.chatButton} onClick={() => setIsOpen(!isOpen)}>
        {/* Chat Icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
            <div className={styles.tabs}>
                <button 
                  className={`${styles.tab} ${activeTab === 'chat' ? styles.active : ''}`}
                  onClick={() => setActiveTab('chat')}
                >
                  Chat
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'participants' ? styles.active : ''}`}
                  onClick={() => setActiveTab('participants')}
                >
                  Participants
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'chat' ? (
                    <>
                        {messages.map(msg => (
                            <div key={msg.id} className={`${styles.messageRow} ${msg.isOwn ? styles.own : styles.other}`}>
                                <span className={styles.senderName}>{msg.sender}</span>
                                <div className={styles.messageBubble}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #eee', color: '#999', fontSize: '0.9rem' }}>
                            Name
                        </div>
                        {participants.map((p, i) => (
                            <div key={i} style={{ 
                                fontWeight: 600, 
                                fontSize: '0.9rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span>{p}</span>
                                {isTeacher && p !== 'Teacher' && (
                                    <button 
                                        onClick={() => handleKick(p)}
                                        style={{
                                            background: 'none',
                                            color: '#FA314A', // --accent red
                                            border: '1px solid #FA314A',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        Kick
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {activeTab === 'chat' && (
                <div className={styles.inputArea}>
                    <input 
                      className={styles.input} 
                      placeholder="Type a message..." 
                      value={message}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
                    />
                    <button className={styles.sendBtn} onClick={handleSend}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
