import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import { MessageSquare, Send, User, Lock, ShieldCheck, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MessagesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const fetchConversations = async () => {
    try {
      const data = await fetchApi('/messages/conversations');
      setConversations(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const data = await fetchApi(`/messages/conversations/${convId}`);
      if (Array.isArray(data)) {
        const map = new Map();
        data.forEach((m) => {
          const key = m._id || `${m.senderId}_${m.content}_${m.createdAt}`;
          map.set(key, m);
        });
        const cleanList = Array.from(map.values());
        setMessages(cleanList);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeConv?._id) {
      fetchMessages(activeConv._id);
      setTimeout(scrollToBottom, 100);
      const interval = setInterval(() => fetchMessages(activeConv._id), 4000); // live polling chat
      return () => clearInterval(interval);
    }
  }, [activeConv]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConv) return;

    const textToSend = newMsg.trim();
    setNewMsg('');
    setSending(true);

    try {
      const msg = await fetchApi('/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          conversationId: activeConv._id,
          content: textToSend,
        }),
      });

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id || (m.content === msg.content && m.senderId === msg.senderId));
        return exists ? prev : [...prev, msg];
      });

      setTimeout(scrollToBottom, 50);
      fetchConversations();
    } catch (err: any) {
      alert(err.message || 'Error sending message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-xl overflow-hidden h-[78vh] sm:h-[75vh] flex">
        
        {/* Left Conversations Sidebar */}
        <div
          className={`w-full sm:w-80 border-r border-ivory-300 flex-col bg-ivory-50/50 ${
            showMobileChat ? 'hidden sm:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-ivory-300 bg-white">
            <h2 className="font-serif font-bold text-brand-950 text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gold-600" />
              <span>{t('navMessages')}</span>
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {language === 'EN' ? 'Connected Matrimonial Members' : 'परस्पर स्वीकारलेले सदस्य'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <p className="p-4 text-xs text-gray-400 text-center">Loading chats...</p>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center space-y-3">
                <Lock className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500">
                  {language === 'EN'
                    ? 'Messaging unlocks when an interest request is accepted by both members.'
                    : 'दोन्ही सदस्यांनी आवड स्वीकारल्यानंतरच संदेश संभाषण सुरू होते.'}
                </p>
                <Link to="/interests" className="inline-block text-xs font-semibold text-brand-900 underline">
                  View Interests
                </Link>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => {
                    setActiveConv(conv);
                    setShowMobileChat(true);
                    setConversations((prev) =>
                      prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
                    );
                  }}
                  className={`p-4 cursor-pointer hover:bg-white transition-colors flex items-center gap-3 ${
                    activeConv?._id === conv._id ? 'bg-white border-l-4 border-brand-900 shadow-xs' : ''
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 font-bold text-sm flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                    {conv.partner?.primaryPhoto ? (
                      <img src={conv.partner.primaryPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400 stroke-[1.5]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-brand-950' : 'font-semibold text-gray-900'}`}>
                        {conv.partner?.fullName}
                      </h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] ${conv.unreadCount > 0 ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="min-w-[18px] h-4 px-1.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                      {conv.lastMessage || 'Connected! Start conversation.'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Active Chat Box */}
        <div
          className={`flex-1 flex-col bg-white ${
            showMobileChat ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-ivory-300 flex items-center justify-between bg-ivory-100/60">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="sm:hidden p-1.5 rounded-lg text-gray-700 hover:bg-ivory-200 cursor-pointer"
                    title="Back to conversations"
                  >
                    <ArrowLeft className="w-5 h-5 text-brand-900" />
                  </button>

                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                    {activeConv.partner?.primaryPhoto ? (
                      <img src={activeConv.partner.primaryPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400 stroke-[1.5]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-brand-950 text-xs sm:text-sm">
                      {activeConv.partner?.fullName}
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      ID: {activeConv.partner?.profileId || 'Connected Member'}
                    </p>
                  </div>
                </div>

                {activeConv.partner?.profileId && (
                  <Link
                    to={`/profile/${activeConv.partner.profileId}`}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 border border-brand-900 text-brand-900 text-[11px] sm:text-xs font-semibold rounded-lg hover:bg-brand-50"
                  >
                    {t('viewProfile')}
                  </Link>
                )}
              </div>

              {/* Messages Body */}
              <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-ivory-50/30">
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 pt-10">
                    No messages exchanged yet. Say Namaste!
                  </p>
                ) : (
                  messages.map((m) => {
                    const isMine = m.senderId === user?.id;
                    return (
                      <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] sm:max-w-md p-3 rounded-2xl text-xs space-y-1 shadow-2xs ${
                            isMine
                              ? 'bg-brand-900 text-white rounded-br-none'
                              : 'bg-white border border-ivory-300 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p className="leading-relaxed">{m.content}</p>
                          <div
                            className={`text-[9px] flex items-center justify-end gap-1 ${
                              isMine ? 'text-gold-300/90' : 'text-gray-400'
                            }`}
                          >
                            <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMine && (
                              m.isRead ? (
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <Check className="w-3 h-3 text-gold-300/70 shrink-0" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSend} className="p-3 border-t border-ivory-300 flex items-center gap-2 bg-white">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder={language === 'EN' ? 'Type a respectful message...' : 'येथे संदेश लिहा...'}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-base sm:text-xs focus:ring-2 focus:ring-brand-900"
                />
                <button
                  type="submit"
                  disabled={sending || !newMsg.trim()}
                  className="p-2.5 rounded-xl bg-brand-900 text-gold-300 hover:bg-brand-950 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2 text-gray-400">
              <MessageSquare className="w-12 h-12" />
              <p className="text-xs">Select a conversation from the left sidebar to start chatting.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
