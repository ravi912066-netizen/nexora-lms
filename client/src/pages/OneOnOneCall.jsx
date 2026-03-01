import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
    StopCircle, ArrowLeft, Mic, MicOff, Video, VideoOff,
    Maximize2, Minimize2, Clock, Shield, PhoneCall, Users,
    MessageSquare, Copy, CheckCheck
} from 'lucide-react';

const OneOnOneCall = () => {
    const { roomId, studentId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ending, setEnding] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const containerRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        // Start session timer
        timerRef.current = setInterval(() => {
            setElapsed(prev => prev + 1);
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const formatDuration = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const handleEndCall = async () => {
        if (!window.confirm('End this 1-on-1 session?')) return;
        try {
            setEnding(true);
            if (timerRef.current) clearInterval(timerRef.current);
            if (user.role === 'admin' && studentId) {
                await api.put(`/auth/call/end/${studentId}`);
            }
            navigate(user.role === 'admin' ? '/admin/students' : '/profile');
        } catch (error) {
            console.error('Failed to end call', error);
            alert('Failed to end call');
            setEnding(false);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div ref={containerRef} className="max-w-[1600px] mx-auto p-4 flex flex-col gap-4 h-[calc(100vh-2rem)]">

            {/* Top Control Bar */}
            <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-700">
                {/* Left: Back + Session Info */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleEndCall}
                        className="p-2.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-300 hover:text-white"
                        title="Leave session"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-8 w-px bg-slate-700" />
                    <div>
                        <h2 className="font-black text-white tracking-tight flex items-center gap-2">
                            <PhoneCall size={16} className="text-emerald-400" />
                            1-on-1 Secure Session
                        </h2>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2 mt-0.5">
                            <Shield size={10} className="text-emerald-500" /> End-to-End Encrypted Mission Channel
                        </div>
                    </div>
                </div>

                {/* Center: Status Badges */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Live indicator */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Live</span>
                    </div>
                    {/* Timer */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl">
                        <Clock size={14} className="text-blue-400" />
                        <span className="text-white text-xs font-black font-mono tracking-widest">{formatDuration(elapsed)}</span>
                    </div>
                    {/* Participants */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl">
                        <Users size={14} className="text-purple-400" />
                        <span className="text-white text-xs font-black">2 Participants</span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Copy Room ID */}
                    <button
                        onClick={handleCopyRoomId}
                        title="Copy Room ID"
                        className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all text-xs font-bold border border-slate-700"
                    >
                        {copied ? <CheckCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Room ID'}
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                        onClick={toggleFullscreen}
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700"
                    >
                        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>

                    {/* End Call */}
                    {(user.role === 'admin' && studentId) ? (
                        <button
                            onClick={handleEndCall}
                            disabled={ending}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 text-sm uppercase tracking-wider"
                        >
                            <StopCircle size={18} />
                            {ending ? 'Ending...' : 'End Session'}
                        </button>
                    ) : (
                        <button
                            onClick={handleEndCall}
                            disabled={ending}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-black rounded-xl transition-all border border-red-500/30 disabled:opacity-50 text-sm uppercase tracking-wider"
                        >
                            <StopCircle size={18} />
                            {ending ? 'Leaving...' : 'Leave Call'}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Status Bar */}
            <div className="flex md:hidden items-center gap-3 justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Live</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
                    <Clock size={12} className="text-blue-600" />
                    <span className="text-slate-800 text-[10px] font-black font-mono">{formatDuration(elapsed)}</span>
                </div>
            </div>

            {/* Main Video Container - Jitsi Embed */}
            <div className="flex-1 bg-slate-950 rounded-3xl overflow-hidden shadow-2xl relative border-2 border-slate-800 group min-h-0">
                <iframe
                    src={`https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.disableDeepLinking=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","profile","chat","recording","livestreaming","sharedvideo","settings","raisehand","videoquality","filmstrip","feedback","stats","shortcuts","tileview","select-background","help","mute-everyone","security"]`}
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                    className="w-full h-full border-none"
                    title="1-on-1 Nexora Video Session"
                />

                {/* Overlay tip - fades out */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none">
                    <MessageSquare size={12} className="text-blue-400" />
                    Use the Jitsi toolbar to control microphone, camera & more
                </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-widest font-bold px-2">
                <span className="flex items-center gap-1.5">
                    <Shield size={10} className="text-emerald-500" />
                    Nexora Secure Protocol · AES-256 Encrypted
                </span>
                <span className="flex items-center gap-1.5 truncate max-w-[240px]">
                    Room: <span className="text-slate-400 font-mono normal-case tracking-normal">{roomId?.slice(0, 32)}...</span>
                </span>
            </div>
        </div>
    );
};

export default OneOnOneCall;
