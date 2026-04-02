
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Smartphone, ShieldCheck, ArrowRight, Chrome, Facebook, AlertCircle, MessageSquare, Timer, RefreshCcw, MailCheck } from 'lucide-react';
import { AppRoute, User as UserType } from '../types';

interface RegisterProps {
  onNavigate: (route: string) => void;
  onRegister: (user: UserType, password?: string) => void;
  existingEmails: string[];
  existingPhones: string[];
  onSocialAuth?: (provider: 'google' | 'facebook') => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate, onRegister, existingEmails, existingPhones, onSocialAuth }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  
  // OTP States
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);
  const [showOtpPreview, setShowOtpPreview] = useState<boolean>(false);
  const [showEmailOtpPreview, setShowEmailOtpPreview] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setTimer(60);
    setStep('otp');
    setShowOtpPreview(true);
    setShowEmailOtpPreview(true);
    // Hide notifications after 10 seconds
    setTimeout(() => {
      setShowOtpPreview(false);
      setShowEmailOtpPreview(false);
    }, 10000);
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Email validation
    if (existingEmails.includes(formData.email.toLowerCase())) {
      setError("This email address is already registered.");
      return;
    }

    // Phone validation: 11 digits, starts with 03
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid 11-digit Pakistani phone number starting with '03'.");
      return;
    }

    // Duplicate phone check
    if (existingPhones.includes(formData.phone)) {
      setError("This phone number is already registered.");
      return;
    }

    // Password validation: Capital, small, digit, special, min 6
    const passwordRegex = /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{5,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be 6+ chars, start with Capital, include small, numbers & symbols.");
      return;
    }

    sendOtp();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === generatedOtp) {
      const newUser: UserType = {
        id: 'u' + Date.now(),
        name: formData.name,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        role: 'user'
      };
      onRegister(newUser, formData.password);
    } else {
      setError("Invalid OTP code. Please check your SMS or Email.");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gray-50/30">
      {/* Simulated SMS Notification */}
      {showOtpPreview && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm animate-bounce">
          <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">SubKuch Phone Verify</p>
              <p className="text-sm font-bold">Your code is: <span className="text-xl tracking-[4px] text-emerald-400">{generatedOtp}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Email Notification */}
      {showEmailOtpPreview && (
        <div className="fixed top-48 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm animate-fadeIn delay-500">
          <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <MailCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">SubKuch Email OTP</p>
              <p className="text-sm font-bold leading-tight">Verification code <span className="underline">{generatedOtp}</span> sent to {formData.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-8 md:p-12 animate-fadeIn relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className={`h-full transition-all duration-500 bg-emerald-500 ${step === 'details' ? 'w-1/2' : 'w-full'}`} />
          <div className="h-full flex-grow bg-gray-100" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">
            {step === 'details' ? 'Create Account' : 'Security Check'}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {step === 'details' ? "Join Pakistan's favorite marketplace" : `Verification code sent to email & ${formData.phone}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold animate-shake flex items-center gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {step === 'details' ? (
          <>
            <div className="space-y-4 mb-10">
              <button 
                onClick={() => onSocialAuth?.('google')}
                className="w-full flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all group"
              >
                <Chrome className="w-5 h-5 text-red-500 transition-transform group-hover:scale-110" />
                Sign up with Google
              </button>
            </div>

            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-gray-400">
                <span className="bg-white px-4">Account Information</span>
              </div>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-5">
              <div className="relative group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" required placeholder="M. Fahad Zaib" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full pl-12 p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 outline-none font-bold text-gray-900" 
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="tel" required maxLength={11} placeholder="03XXXXXXXXX" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} 
                    className="w-full pl-12 p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 outline-none font-bold text-gray-900" 
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="email" required placeholder="fahad@subkuch.pk" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full pl-12 p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 outline-none font-bold text-gray-900" 
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="password" required placeholder="Aabc1!" 
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                    className="w-full pl-12 p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 outline-none font-bold text-gray-900" 
                  />
                </div>
                <p className="text-[9px] text-gray-400 mt-2 ml-1 italic font-medium">Starts with Capital, includes small letters, numbers & special characters.</p>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  Continue to OTP <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8 animate-fadeIn">
            <div className="flex justify-center gap-3">
              <div className="relative w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <input 
                  type="text" 
                  required 
                  maxLength={6} 
                  placeholder="Enter 6-digit code"
                  value={enteredOtp}
                  onChange={e => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-14 p-6 bg-gray-50 border-2 border-emerald-100 rounded-[2rem] text-center text-2xl font-black tracking-[10px] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              {timer > 0 ? (
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                  <Timer className="w-4 h-4" /> Resend in {timer}s
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={sendOtp}
                  className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline"
                >
                  <RefreshCcw className="w-4 h-4" /> Resend Code
                </button>
              )}

              <button 
                type="submit" 
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 active:scale-[0.98] transition-all"
              >
                Verify & Join Now
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep('details')}
                className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-900 transition-colors"
              >
                Go Back & Edit Info
              </button>
            </div>
          </form>
        )}

        <div className="mt-12 text-center pt-8 border-t border-gray-50">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Already have an account? <button onClick={() => onNavigate(AppRoute.LOGIN)} className="text-emerald-600 font-black hover:underline">Sign In Now</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
