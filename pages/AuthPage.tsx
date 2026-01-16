
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, Star, Check } from 'lucide-react';

const AuthPage: React.FC<{ t: any, locale: string, onLogin: (u: any) => void }> = ({ t, locale, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real production app, this would use Supabase Auth.
    // Here we use the specified admin credentials for item management.
    const mockUser = { email, name: email === 'admin@rahaltent.com' ? 'Administrator' : 'Valued Client' };
    onLogin(mockUser);
    if (email === 'admin@rahaltent.com') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center">
        <img 
          src="http://app.rahaltent.com/wp-content/uploads/2024/07/103.png" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-80 transition-opacity duration-1000"
          alt="Luxury Tent Branding"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        
        <div className="relative z-10 p-20 text-white animate-in slide-in-from-left-12 duration-1000">
          <div className="w-24 h-24 bg-brand-yellow rounded-[2.5rem] flex items-center justify-center font-black text-5xl text-black mb-12 shadow-2xl">RT</div>
          <h2 className="text-7xl font-black mb-10 leading-[0.9] tracking-tighter">
            {locale === 'ar' ? 'إدارة الفعاليات\nبكل سهولة.' : 'Manage Events\nWith Ease.'}
          </h2>
          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/5">
                <Star className="w-6 h-6 text-brand-yellow" />
              </div>
              <p className="font-black text-xl text-gray-200 uppercase tracking-tight">{locale === 'ar' ? 'نظام احترافي موحد' : 'Unified Executive Panel'}</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/5">
                <ShieldCheck className="w-6 h-6 text-green-400" />
              </div>
              <p className="font-black text-xl text-gray-200 uppercase tracking-tight">{locale === 'ar' ? 'أمان عالي للبيانات' : 'High Performance Security'}</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-12 text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">
          Rahal Tent © 2025 | Premium Bahrain Operations
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-24 bg-gray-50/30">
        <div className="w-full max-w-lg animate-in slide-in-from-right-12 duration-700">
          <div className="lg:hidden text-center mb-16">
            <div className="w-20 h-20 bg-brand-yellow rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-6 shadow-2xl">RT</div>
          </div>

          <div className="mb-16">
            <h2 className="text-6xl font-black mb-6 tracking-tighter text-gray-900 leading-none">{t.login}</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              {locale === 'ar' ? 'أدخل بياناتك للوصول إلى لوحة الإدارة' : 'Enter admin credentials to manage assets'}
            </p>
            <div className="mt-8 p-6 bg-brand-yellow/5 border border-brand-yellow/10 rounded-3xl">
              <p className="text-[10px] font-black text-brand-yellow uppercase tracking-widest mb-1">Audit Note</p>
              <p className="text-xs font-bold text-gray-500 italic">Admin Login: admin@rahaltent.com</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-3">{locale === 'ar' ? 'البريد الإلكتروني' : 'Executive Email'}</label>
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  className="w-full bg-white border border-gray-100 rounded-[2rem] px-8 py-6 outline-none focus:border-brand-yellow focus:ring-8 focus:ring-brand-yellow/5 transition-all pl-20 font-black text-xl shadow-sm"
                  placeholder="admin@rahaltent.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className={`absolute top-1/2 -translate-y-1/2 ${locale === 'ar' ? 'right-8 border-r pr-5' : 'left-8 border-r pr-5'} text-gray-300 group-focus-within:text-brand-yellow transition-colors border-gray-100`}>
                  <Mail className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-3">{locale === 'ar' ? 'كلمة المرور' : 'Secure Token / Password'}</label>
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  className="w-full bg-white border border-gray-100 rounded-[2rem] px-8 py-6 outline-none focus:border-brand-yellow focus:ring-8 focus:ring-brand-yellow/5 transition-all pl-20 font-black text-xl shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className={`absolute top-1/2 -translate-y-1/2 ${locale === 'ar' ? 'right-8 border-r pr-5' : 'left-8 border-r pr-5'} text-gray-300 group-focus-within:text-brand-yellow transition-colors border-gray-100`}>
                  <Lock className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-3">
               <label className="flex items-center gap-4 cursor-pointer group">
                 <div className="relative w-6 h-6">
                   <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                   <div className="w-full h-full border-2 border-gray-200 rounded-xl group-hover:border-brand-yellow peer-checked:bg-brand-yellow peer-checked:border-brand-yellow transition-all flex items-center justify-center">
                     <Check className="w-4 h-4 text-black scale-0 peer-checked:scale-100 transition-transform" />
                   </div>
                 </div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{locale === 'ar' ? 'تذكر الجلسة' : 'Persist Session'}</span>
               </label>
               <button type="button" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-yellow transition-colors">{locale === 'ar' ? 'فقدان الرمز؟' : 'Lost Token?'}</button>
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white py-8 rounded-[2.5rem] font-black text-2xl hover:bg-brand-yellow hover:text-black transition-all shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-5 group"
            >
              <span>{t.login}</span>
              {locale === 'ar' ? <ArrowLeft className="w-8 h-8 group-hover:-translate-x-3 transition-transform" /> : <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />}
            </button>
          </form>

          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-6">{locale === 'ar' ? 'هل تطلب أوراق اعتماد جديدة؟' : "Requesting New Executive Access?"}</p>
            <button className="text-gray-900 font-black uppercase tracking-[0.25em] text-xs hover:text-brand-yellow transition-colors border-b-2 border-brand-yellow/30 pb-1">{locale === 'ar' ? 'اتصل بالإدارة' : 'Contact Headquarters'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
