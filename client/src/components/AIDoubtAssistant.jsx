import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, User } from 'lucide-react';
import clsx from 'clsx';

const AIDoubtAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Namaste! Main Nexora AI hoon. Aapko koi doubt hai? Kuch bhi pucho!' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Thinking
        setTimeout(() => {
            let aiResponse = "Main abhi sikh raha hoon, par aapka sawal bahut accha hai! Kya main Ravi Yadav bhai se baat karke aapko bataun?";

            // Simple keyword responses
            const lowerInput = input.toLowerCase();
            if (lowerInput.includes('react')) aiResponse = "React ek awesome library hai UI banane ke liye! Components aur Hooks par dhyan dein.";
            if (lowerInput.includes('js') || lowerInput.includes('javascript')) aiResponse = "JavaScript web ki jaan hai! Closures aur Promises zaroor padhein.";
            if (lowerInput.includes('hello') || lowerInput.includes('hi')) aiResponse = "Hello Cadet! Kaise ho? Kuch help chahiye coding mein?";
            if (lowerInput.includes('placement')) aiResponse = "Mehnat karte rahein, Nexora Edu aapko placement ke liye ready kar dega!";

            setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all active:scale-95 group relative"
                >
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                    <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-sm tracking-tight leading-none flex items-center gap-1">
                                    Nexora AI <Sparkles size={12} className="text-blue-400" />
                                </h4>
                                <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mt-1">Doubt Assistant</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={clsx("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                                <div className={clsx(
                                    "max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                                    m.role === 'user'
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                                )}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:200ms]"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:400ms]"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-5 pr-14 py-4 bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                placeholder="Pucho pucho, kya doubt hai?..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all shadow-lg shadow-blue-100"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest mt-3">Powered by Nexora Neural Engine</p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIDoubtAssistant;
