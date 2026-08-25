'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  isFromAdmin: boolean;
  createdAt: string;
  readAt?: string | null;
  sender?: { name: string } | null;
}

export default function ChatPageClient() {
  const t = useTranslations('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({ name: '', email: '' });
  const [showInfoForm, setShowInfoForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize visitor session
  useEffect(() => {
    const initSession = async () => {
      const storedSessionId = localStorage.getItem('visitor_session_id');
      
      try {
        const res = await fetch(`/api/visitor${storedSessionId ? `?sessionId=${storedSessionId}` : ''}`);
        const data = await res.json();
        setSessionId(data.sessionId);
        localStorage.setItem('visitor_session_id', data.sessionId);
        
        if (data.name || data.email) {
          setVisitorInfo({ name: data.name || '', email: data.email || '' });
        }
      } catch (error) {
        console.error('Failed to initialize visitor session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initSession();
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const res = await fetch(`/api/visitor/messages?sessionId=${sessionId}`);
      const data = await res.json();
      setMessages(data);
      
      // Mark admin messages as read
      const unreadAdminIds = data
        .filter((m: Message) => m.isFromAdmin && !m.readAt)
        .map((m: Message) => m.id);
      
      if (unreadAdminIds.length > 0) {
        await fetch('/api/visitor/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, messageIds: unreadAdminIds }),
        });
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchMessages();
    }
  }, [sessionId, fetchMessages]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!sessionId) return;
    
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [sessionId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !sessionId || isSending) return;
    
    setIsSending(true);
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      content: message,
      isFromAdmin: false,
      createdAt: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, tempMessage]);
    const messageContent = message;
    setMessage('');
    
    try {
      const res = await fetch('/api/visitor/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          content: messageContent,
          name: visitorInfo.name || undefined,
          email: visitorInfo.email || undefined,
        }),
      });
      
      const data = await res.json();
      setMessages((prev) => prev.filter((m) => m.id !== tempId).concat(data));
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateInfo = async () => {
    if (!sessionId) return;
    
    try {
      await fetch('/api/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          name: visitorInfo.name || undefined,
          email: visitorInfo.email || undefined,
        }),
      });
      setShowInfoForm(false);
    } catch (error) {
      console.error('Failed to update visitor info:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Retour</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">{t('title')}</h1>
                  <p className="text-xs text-gray-500">{t('subtitle')}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowInfoForm(!showInfoForm)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {visitorInfo.name || visitorInfo.email ? 'Modifier mes infos' : 'Me identifier'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Info Form */}
        {showInfoForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4"
          >
            <h3 className="font-semibold text-gray-900 mb-3">Vos informations (optionnel)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Votre nom"
                value={visitorInfo.name}
                onChange={(e) => setVisitorInfo({ ...visitorInfo, name: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="email"
                placeholder="Votre email"
                value={visitorInfo.email}
                onChange={(e) => setVisitorInfo({ ...visitorInfo, email: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUpdateInfo}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setShowInfoForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        )}

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Messages */}
          <div className="h-[calc(100vh-350px)] min-h-[400px] overflow-y-auto p-4 sm:p-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-3 max-w-[70%]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-none">
                        <p className="text-sm leading-relaxed">{t('welcome')}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.isFromAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[70%] ${msg.isFromAdmin ? '' : 'flex-row-reverse'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isFromAdmin ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-indigo-600'}`}>
                        {msg.isFromAdmin ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                      </div>
                      <div className={`p-4 rounded-2xl ${msg.isFromAdmin ? 'bg-gray-100 text-gray-800 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-2 ${msg.isFromAdmin ? 'text-gray-500' : 'text-indigo-200'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.sender && ` · ${msg.sender.name}`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t('placeholder')}
                disabled={isSending || !sessionId}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || isSending || !sessionId}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white p-3 rounded-xl transition-colors disabled:cursor-not-allowed"
              >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
