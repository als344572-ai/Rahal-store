
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { translations } from './translations';
import { Locale, Booking } from './types';
import { ShoppingCart, User, Globe, LayoutDashboard, LogIn, Apple, Play, Instagram, Twitter } from 'lucide-react';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';

const App: React.FC = () => {
  const [locale, setLocale] = useState<Locale>(
    (localStorage.getItem('rahal-locale') as Locale) || 'ar'
  );
  const [cart, setCart] = useState<Booking[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('rahal-locale', locale);
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useMemo(() => translations[locale], [locale]);

  const toggleLocale = () => {
    setLocale(prev => prev === 'en' ? 'ar' : 'en');
  };

  const isAdmin = user?.email === 'admin@rahaltent.com';

  return (
    <Router>
      <div className={`min-h-screen bg-brand-yellow text-black selection:bg-black selection:text-brand-yellow ${locale === 'ar' ? 'font-cairo' : 'font-inter'}`}>
        {/* Professional Navigation */}
        <nav className="sticky top-0 z-50 bg-brand-yellow/90 backdrop-blur-xl border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-24">
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-4">
                  <img 
                    src="https://raw.githubusercontent.com/RahalTent/assets/main/logo_ship.png" 
                    alt="Emblem" 
                    className="h-14 w-auto drop-shadow-sm" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                  />
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tighter text-black leading-none uppercase">
                      RAHAL
                    </span>
                    <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">
                      TENT GROUP W.L.L
                    </span>
                  </div>
                </Link>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-10 space-x-reverse">
                <Link to="/" className="text-xs font-black uppercase tracking-widest text-black/60 hover:text-black transition-colors">{t.home}</Link>
                <Link to="/shop" className="text-xs font-black uppercase tracking-widest text-black/60 hover:text-black transition-colors">{t.shop}</Link>
                <Link to="/about" className="text-xs font-black uppercase tracking-widest text-black/60 hover:text-black transition-colors">{t.about}</Link>
              </div>

              <div className="flex items-center gap-3 sm:gap-6">
                <button 
                  onClick={toggleLocale}
                  className="p-3 rounded-2xl hover:bg-black/5 transition-all flex items-center gap-3 text-black/60"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{locale === 'ar' ? 'English' : 'عربي'}</span>
                </button>

                <Link to="/cart" className="p-3 relative hover:bg-black/5 rounded-2xl transition-all text-black/60">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-brand-yellow text-[9px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-brand-yellow">
                      {cart.length}
                    </span>
                  )}
                </Link>

                {isAdmin && (
                  <Link to="/admin" className="p-3 hover:bg-black/5 rounded-2xl transition-all text-black/60">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}

                {user ? (
                   <button onClick={() => setUser(null)} className="flex items-center gap-4 bg-black text-brand-yellow px-5 py-3 rounded-2xl hover:scale-105 transition-all shadow-xl">
                     <User className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase hidden sm:block">{user.name || 'User'}</span>
                   </button>
                ) : (
                  <Link to="/auth" className="flex items-center gap-3 bg-black text-brand-yellow px-8 py-3.5 rounded-2xl font-black text-xs hover:bg-black/90 transition-all shadow-xl shadow-black/10">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline uppercase tracking-[0.2em]">{t.login}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-[70vh]">
          <Routes>
            <Route path="/" element={<HomePage t={t} locale={locale} />} />
            <Route path="/shop" element={<ShopPage t={t} locale={locale} />} />
            <Route path="/product/:id" element={<ProductDetailsPage t={t} locale={locale} onAddToCart={(item) => setCart([...cart, item])} />} />
            <Route path="/cart" element={<CartPage t={t} locale={locale} cart={cart} onRemove={(id) => setCart(cart.filter(i => i.id !== id))} />} />
            <Route path="/admin/*" element={<AdminDashboard t={t} locale={locale} />} />
            <Route path="/auth" element={<AuthPage t={t} locale={locale} onLogin={(u) => setUser(u)} />} />
          </Routes>
        </main>

        {/* High-End Black Footer */}
        <footer className="bg-black text-white pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
              <div className="space-y-10">
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-black tracking-tighter text-brand-yellow">RAHAL TENT</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">GROUP W.L.L</span>
                </div>
                <p className="text-white/40 leading-relaxed text-sm font-medium italic">{t.slogan}</p>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-all">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black mb-10 tracking-[0.4em] uppercase text-brand-yellow">{t.shop}</h4>
                <ul className="space-y-5 text-sm font-bold text-white/50">
                  <li><Link to="/shop" className="hover:text-brand-yellow transition-colors">{locale === 'ar' ? 'خيام تراثية' : 'Heritage Tents'}</Link></li>
                  <li><Link to="/shop" className="hover:text-brand-yellow transition-colors">{locale === 'ar' ? 'جلسات خارجية' : 'Outdoor Seating'}</Link></li>
                  <li><Link to="/shop" className="hover:text-brand-yellow transition-colors">{locale === 'ar' ? 'معدات المناسبات' : 'Event Gear'}</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-black mb-10 tracking-[0.4em] uppercase text-brand-yellow">Support</h4>
                <ul className="space-y-5 text-sm font-bold text-white/50">
                  <li><Link to="/about" className="hover:text-brand-yellow transition-colors">{t.about}</Link></li>
                  <li><Link to="/contact" className="hover:text-brand-yellow transition-colors">{t.contact}</Link></li>
                  <li><Link to="/terms" className="hover:text-brand-yellow transition-colors">{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="text-[10px] font-black mb-8 tracking-[0.4em] uppercase text-brand-yellow">{locale === 'ar' ? 'تحميل التطبيق' : 'Download App'}</h4>
                <div className="flex flex-col gap-5">
                  <a href="#" className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all">
                    <Apple className="w-6 h-6 text-brand-yellow" />
                    <div>
                      <span className="block text-[8px] font-black uppercase text-white/40 tracking-widest">App Store</span>
                      <span className="block text-xs font-black text-white italic">Download</span>
                    </div>
                  </a>
                  <a href="#" className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all">
                    <Play className="w-6 h-6 text-brand-yellow" />
                    <div>
                      <span className="block text-[8px] font-black uppercase text-white/40 tracking-widest">Play Store</span>
                      <span className="block text-xs font-black text-white italic">Get it on</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/5 mt-24 pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} {t.brandName}. Elite Operations Bahrain.</p>
              <div className="flex items-center gap-10 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                <span className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div> Secure SSL</span>
                <span className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div> Stripe Integrated</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
