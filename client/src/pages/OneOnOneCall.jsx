import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { StopCircle, ArrowLeft } from 'lucide-react';

const OneOnOneCall = () => {
    const { roomId, studentId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ending, setEnding] = useState(false);

    const handleEndCall = async () => {
        if (!window.confirm("End this 1-on-1 session?")) return;

        try {
            setEnding(true);
            // Only Admin can officially end the call room for the student
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

    return (
        <div className="max-w-[1500px] mx-auto p-4 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <button onClick={handleEndCall} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="font-bold text-slate-800">1-on-1 Video Comms</h2>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Encrypted Mission Channel</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Secure Connection
                    </div>
                    {user.role === 'admin' && studentId ? (
                        <button onClick={handleEndCall} disabled={ending} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-red-500/30 flex items-center gap-2 disabled:opacity-50">
                            <StopCircle size={18} /> {ending ? 'Ending...' : 'End Transmission'}
                        </button>
                    ) : (
                        <button onClick={handleEndCall} disabled={ending} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-red-500/30 flex items-center gap-2 disabled:opacity-50">
                            <StopCircle size={18} /> Disconnect
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-slate-950 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-900 group">
                <iframe
                    src={`https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","profile","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","invite","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","security"]`}
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                    className="w-full h-full border-none"
                    title="1-on-1 Video Call"
                />
            </div>
        </div>
    );
};

export default OneOnOneCall;
