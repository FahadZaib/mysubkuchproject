
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Facebook, Chrome, AlertCircle } from 'lucide-react';
import { AppRoute } from '../types';

interface LoginProps {
  onNavigate: (route: string) => void;
  onLoginAttempt: (email: string, pass: string) => Promise<boolean>;
  onSocialAuth?: (provider: 'google' | 'facebook') => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLoginAttempt, onSocialAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await onLoginAttempt(email, password);
    if (!success) {
      setError("We couldn't find an account with those credentials.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-gray-50/30">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-8 md:p-12 animate-fadeIn">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">Welcome Back</h1>
          <p className="text-gray-500 text-sm font-medium">Log in to your SubKuch account</p>
        </div>

        {/* Social Authentication */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => onSocialAuth?.('google')}
            className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all group"
          >
            <Chrome className="w-5 h-5 text-red-500 transition-transform group-hover:scale-110" />
            Google
          </button>
          <button 
            onClick={() => onSocialAuth?.('facebook')}
            className="flex items-center justify-center gap-3 py-4 bg-[#1877F2] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#166fe5] transition-all group shadow-lg shadow-blue-200"
          >
            <Facebook className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
            Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-gray-400">
            <span className="bg-white px-4">Or use credentials</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="email" 
                required 
                placeholder="Email address"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl outline-none font-bold text-gray-900 transition-all focus:ring-2 focus:ring-emerald-500/10" 
              />
            </div>
          </div>

          <div className="space-y-1 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="password" 
                required 
                placeholder="Your password"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl outline-none font-bold text-gray-900 transition-all focus:ring-2 focus:ring-emerald-500/10" 
              />
            </div>
            <div className="flex justify-end mt-2">
              <button type="button" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Forgot Password?</button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            Log In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            New to SubKuch.pk? <button onClick={() => onNavigate(AppRoute.REGISTER)} className="text-emerald-600 font-black hover:underline">Create Account</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
