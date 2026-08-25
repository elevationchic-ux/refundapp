'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minimize2, Maximize2, Bot, User, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Message {
  id: string;
  content: string;
  isFromAdmin: boolean;
  createdAt: string;
  readAt?: string | null;
  sender?: { name: string } | null;
}

export default function ChatWidget() {
  const t = useTranslations('chat');
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mount check for hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize visitor session
  useEffect(() => {
    if (!isMounted) return;
    
    const initSession = async () => {
      const storedSessionId = localStorage.getItem('visitor_session_id');
      
      try {
        const res = await fetch(`/api/visitor${storedSessionId ? `?sessionId=${storedSessionId}` : ''}`);
        if (!res.ok) {
          console.warn('Failed to fetch visitor session, using fallback');
          // Use a fallback session ID
          const fallbackId = storedSessionId || `fallback-${Date.now()}`;
          setSessionId(fallbackId);
          localStorage.setItem('visitor_session_id', fallbackId);
          return;
        }
        const data = await res.json();
        if (data.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem('visitor_session_id', data.sessionId);
        }
      } catch (error) {
        console.error('Failed to initialize visitor session:', error);
        // Use a fallback session ID
        const fallbackId = storedSessionId || `fallback-${Date.now()}`;
        setSessionId(fallbackId);
        localStorage.setItem('visitor_session_id', fallbackId);
      }
    };
    
    initSession();
  }, [isMounted]);

  // Fetch messages when session is ready
  const fetchMessages = useCallback(async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (isOpen && sessionId) {
      fetchMessages();
    }
  }, [isOpen, sessionId, fetchMessages]);

  // Poll for new messages every 5 seconds when open
  useEffect(() => {
    if (!isOpen || !sessionId) return;
    
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [isOpen, sessionId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

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
    setMessage('');
    
    try {
      const res = await fetch('/api/visitor/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, content: message }),
      });
      
      const data = await res.json();
      
      // Replace temp message with real one
      setMessages((prev) => prev.filter((m) => m.id !== tempId).concat(data));
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-colors ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-80 sm:w-96 transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[420px]'}`}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t('title')}</h4>
                  <p className="text-xs text-indigo-100">{t('subtitle')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/20 rounded transition-colors">
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {isLoading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {messages.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="flex items-start space-x-2 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-600">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="p-3 rounded-2xl bg-white text-gray-800 border border-gray-200 rounded-bl-sm">
                              <p className="text-sm">{t('welcome')}</p>
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
                          <div className={`flex items-start space-x-2 max-w-[80%] ${msg.isFromAdmin ? '' : 'flex-row-reverse space-x-reverse'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isFromAdmin ? 'bg-purple-600' : 'bg-indigo-600'}`}>
                              {msg.isFromAdmin ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                            </div>
                            <div className={`p-3 rounded-2xl ${msg.isFromAdmin ? 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm' : 'bg-indigo-600 text-white rounded-br-sm'}`}>
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${msg.isFromAdmin ? 'text-gray-500' : 'text-indigo-200'}`}>
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
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center space-x-2">
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
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!message.trim() || isSending || !sessionId}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
