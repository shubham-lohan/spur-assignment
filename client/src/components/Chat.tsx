import React, { useState, useEffect, useRef } from 'react';
import { Send, Store, AlertCircle, PlusCircle, Trash2 } from 'lucide-react';
import { sendMessage, getHistory } from '../api';
import type { Message } from '../types';

const FAQ_CHIPS = [
  "What's your return policy?",
  "Do you ship to Canada?",
  "What are your support hours?",
  "Where is my order?",
];

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const savedSessionId = localStorage.getItem('chatSessionId');
      if (savedSessionId) {
        loadSession(savedSessionId);
      } else {
          initGreeting();
      }
    }
  }, []);

  const loadSession = (id: string) => {
      setSessionId(id);
      setLoading(true);
      getHistory(id)
        .then((response) => {
            const msgs = response.messages;
            const normalizedMsgs = msgs.map((m: any) => ({
                ...m,
                sender: m.sender.toLowerCase() === 'user' ? 'user' : 'ai'
            }));
            setMessages(normalizedMsgs);
            localStorage.setItem('chatSessionId', id);
        })
        .catch((err) => {
            console.error("Failed to load history:", err);
            localStorage.removeItem('chatSessionId');
            initGreeting();
        })
        .finally(() => setLoading(false));
  };

  const initGreeting = () => {
      setSessionId(undefined);
      setMessages([{
        text: "Hi there! Welcome to Spur Mart. How can I help you today?",
        sender: 'ai',
        id: 'init'
    }]);
  };

  const handleNewChat = () => {
    localStorage.removeItem('chatSessionId');
    initGreeting();
    setError(null);
  };

  const handleClearHistory = () => {
      handleNewChat();
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { text, sender: 'user', id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      let currentSessionId = sessionId;
      const response = await sendMessage(text, currentSessionId);
      
      if (!currentSessionId) {
        setSessionId(response.sessionId);
        currentSessionId = response.sessionId;
        localStorage.setItem('chatSessionId', response.sessionId);
      }

      const aiMsg: Message = { text: response.reply, sender: 'ai', id: Date.now().toString() + '_ai' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
        console.error(err);
         if (err.response && err.response.status === 429) {
             setError("Rate Limit Exceeded: Please check your OpenAI API billing.");
         } else {
             setError("Failed to send message. Please try again.");
         }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="d-flex w-100 h-100 justify-content-center">
      <div className="d-flex flex-column w-100 h-100 bg-white rounded-3 shadow-sm overflow-hidden position-relative" style={{ maxWidth: '100%' }}>
          
          <div className="p-3 d-flex align-items-center justify-content-between text-white shadow-sm z-2 flex-shrink-0" style={{ background: 'linear-gradient(to right, #7c3aed, #c026d3)' }}>
            <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                    <Store size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="h6 fw-bold mb-0">Spur Mart Support</h1>
                </div>
            </div>
            <div className="d-flex align-items-center gap-2">
                <button 
                    onClick={handleClearHistory}
                    className="btn btn-link text-white p-2 opacity-75 hover-opacity-100"
                    title="Clear History"
                >
                    <Trash2 size={18} />
                </button>
                <button 
                    onClick={handleNewChat}
                    className="btn btn-light text-primary btn-sm d-flex align-items-center gap-1 shadow-sm fw-medium"
                >
                    <PlusCircle size={16} /> New Chat
                </button>
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto p-3 bg-light position-relative" style={{ backgroundColor: '#f8fafc' }}>
            <div className="d-flex flex-column gap-3">
            {messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`d-flex w-100 animate-slide-in ${msg.sender === 'user' ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                    className={`p-3 shadow-sm text-start ${msg.sender === 'user' ? "text-white rounded-3 rounded-top-end-0" : "bg-white text-dark border rounded-3 rounded-top-start-0"}`}
                    style={{ 
                        maxWidth: '85%', 
                        background: msg.sender === 'user' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : '',
                        whiteSpace: 'pre-wrap'
                    }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
                 <div className="d-flex justify-content-start w-100 animate-fade-in">
                    <div className="bg-white border p-3 rounded-3 rounded-top-start-0 shadow-sm d-flex align-items-center gap-1">
                         <span className="spinner-grow spinner-grow-sm text-secondary" role="status" style={{ width: '0.4rem', height: '0.4rem', animationDuration: '0.6s' }}></span>
                         <span className="spinner-grow spinner-grow-sm text-secondary" role="status" style={{ width: '0.4rem', height: '0.4rem', animationDuration: '0.6s', animationDelay: '0.2s' }}></span>
                         <span className="spinner-grow spinner-grow-sm text-secondary" role="status" style={{ width: '0.4rem', height: '0.4rem', animationDuration: '0.6s', animationDelay: '0.4s' }}></span>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="alert alert-danger py-2 px-3 mx-auto d-flex align-items-center gap-2 small rounded-pill shadow-sm" role="alert" style={{ width: 'fit-content' }}>
                    <AlertCircle size={14} /> {error}
                </div>
            )}
            <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-3 bg-white border-top flex-shrink-0">
            {messages.length < 3 && (
                <div className="d-flex gap-2 overflow-auto pb-3 no-scrollbar">
                    {FAQ_CHIPS.map(chip => (
                        <button 
                            key={chip}
                            onClick={() => handleSend(chip)}
                            className="btn btn-light btn-sm rounded-pill border text-muted small text-nowrap"
                            style={{ fontSize: '0.8rem' }}
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            )}

            <div className="d-flex gap-2 align-items-end bg-light p-2 rounded-4 border">
              <textarea
                className="form-control border-0 bg-transparent shadow-none"
                rows={1}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{ resize: 'none', fontSize: '0.95rem' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="btn text-white rounded-3 d-flex align-items-center justify-content-center p-2"
                style={{ 
                    background: 'linear-gradient(to right, #7c3aed, #4f46e5)',
                    width: '42px',
                    height: '42px'
                 }}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center mt-2 d-flex align-items-center justify-content-center gap-1 opacity-50">
                <Store size={12} className="text-muted"/>
                <span className="small text-muted fw-medium" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>POWERED BY SPUR AI</span>
            </div>
          </div>
      </div>
    </div>
  );
};
