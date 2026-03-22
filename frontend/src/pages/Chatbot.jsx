import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const Chatbot = () => {
  // ── STATE ──
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your GECW Admission Assistant. Ask me about Admission, Fees, Departments, Hostel, or Transport.",
      sender: 'bot'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // ── AUTO SCROLL ──
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // ── SEND MESSAGE ──
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/chatbot/query', { query: input });
      setMessages(prev => [...prev, { text: res.data.answer, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        text: "I'm having trouble connecting. Please try again later.",
        sender: 'bot'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ── QUICK QUESTIONS ──
  const quickQuestions = [
    "What are the fees?",
    "What courses are available?",
    "Hostel details?",
    "Admission requirements?",
    "Contact number?"
  ];

  const handleQuick = (question) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl flex flex-col" style={{ height: '650px' }}>

        {/* ── HEADER ── */}
        <div className="bg-blue-700 p-5 text-white flex items-center gap-4 rounded-t-3xl">
          <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>smart_toy</span>
          </div>
          <div>
            <h2 className="font-bold text-lg leading-none">GECW Assistant</h2>
            <span className="text-xs text-white/70 font-medium">Online Helpdesk • Always here to help</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="size-2.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-white/70">Online</span>
          </div>
        </div>

        {/* ── QUICK QUESTIONS ── */}
        <div className="bg-blue-50 border-x border-blue-100 px-4 py-3 flex gap-2 overflow-x-auto">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuick(q)}
              className="whitespace-nowrap px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded-full hover:bg-blue-700 hover:text-white transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* ── MESSAGES AREA ── */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50 border-x border-gray-200"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
            >
              {/* Bot avatar */}
              {msg.sender === 'bot' && (
                <div className="size-8 bg-blue-700 rounded-full flex items-center justify-center mr-2 shrink-0 mt-1">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>smart_toy</span>
                </div>
              )}

              {/* Message bubble */}
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                msg.sender === 'bot'
                  ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  : 'bg-blue-700 text-white rounded-tr-none'
              }`}>
                {/* Format multiline bot messages */}
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} className={line === '' ? 'mt-2' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* Typing animation */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="size-8 bg-blue-700 rounded-full flex items-center justify-center mr-2 shrink-0">
                <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>smart_toy</span>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                <div className="size-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="size-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="size-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* ── INPUT AREA ── */}
        <form
          onSubmit={handleSend}
          className="p-4 bg-white border border-gray-200 rounded-b-3xl flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about admission..."
            className="flex-grow bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="size-12 bg-blue-700 text-white rounded-2xl flex items-center justify-center hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>send</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default Chatbot;