
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowRight, ShieldCheck, Clock, Award, Sparkles, TrendingUp } from 'lucide-react';

const FEATURED_PRODUCTS = [
  { id: 'arabic-ground-majlis', name_ar: 'جلسة أرضية عربية تراثية', name_en: 'Royal Arabic Majlis', price: 18, img: 'https://app.rahaltent.com/wp-content/uploads/2024/07/app-2.png' },
  { id: 'heritage-triple-hanging', name_ar: 'تعليقة تراثية ملكية', name_en: 'Elite Heritage Tent', price: 12.5, img: 'https://app.rahaltent.com/wp-content/uploads/2024/07/280.png' },
  { id: 'arabic-shadow-tent', name_ar: 'خيمة عربية ظلالاية', name_en: 'Sadu Shadow Tent', price: 45, img: 'http://app.rahaltent.com/wp-content/uploads/2025/02/1.png' },
  { id: 'outdoor-pyramid-heater', name_ar: 'دفاية هرمية خارجية', name_en: 'Pyramid Flame Heater', price: 15, img: 'https://app.rahaltent.com/wp-content/uploads/2024/07/35.png' },
];

const HomePage: React.FC<{ t: any, locale: string }> = ({ t, locale }) => {
  return (
    <div className="animate-in bg-brand-yellow">
      {/* Visual Identity Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-brand-yellow pt-10">
        <div className="max-w-7xl mx-auto px-8 w-full flex flex-col md:flex-row items-center gap-16 md:gap-24 relative z-10">
          
          <div className="flex-1 space-y-10 text-center md:text-start">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-black/5 border border-black/10 text-black text-[10px] font-black uppercase tracking-[0.4em] animate-in">
              <Sparkles className="w-4 h-4" />
              {locale === 'ar' ? 'رحال - تجربة ملكية' : 'Rahal - Royal Experience'}
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-black leading-[0.85] tracking-tighter">
              {locale === 'ar' ? (
                <>مجموعة<br/>رحال <span className="text-black/30 text-4xl lg:text-6xl">للمناسبات</span></>
              ) : (
                <>RAHAL<br/><span className="text-black/30">GROUP</span></>
              )}
            </h1>
            
            <p className="text-lg md:text-xl text-black/60 font-bold leading-relaxed max-w-xl mx-auto md:mx-0">
              {locale === 'ar' 
                ? 'نقدم لكم أرقى حلول التجهيز للفعاليات والخيام التراثية في مملكة البحرين. فخامة التصميم ودقة التنفيذ.' 
                : 'Providing you with elite event solutions and heritage tents in the Kingdom of Bahrain. Luxury design and precise execution.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center md:justify-start">
              <Link to="/shop" className="bg-black text-brand-yellow px-14 py-6 rounded-2xl font-black text-lg hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                {t.shop}
                {locale === 'ar' ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
              </Link>
              <Link to="/about" className="bg-white border-2 border-black/5 text-black px-14 py-6 rounded-2xl font-black text-lg hover:bg-black hover:text-white transition-all">
                {t.about}
              </Link>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            <div className="absolute w-[120%] h-[120%] bg-white/40 blur-[120px] rounded-full -z-10"></div>
            <img 
              src="https://raw.githubusercontent.com/RahalTent/assets/main/logo_ship_large.png" 
              className="w-full max-w-xl h-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.15)] animate-bounce-slow"
              alt="Elite Emblem"
              onError={(e) => { e.currentTarget.src = 'http://app.rahaltent.com/wp-content/uploads/2025/02/1.png'; }}
            />
          </div>
        </div>
      </section>

      {/* Feature Section - White Contrast */}
      <section className="py-32 bg-white rounded-t-[5rem] -mt-10 relative z-20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: Award, title: locale === 'ar' ? 'جودة استثنائية' : 'Exceptional Quality', desc: locale === 'ar' ? 'نعتمد أعلى المعايير في اختيار الأقمشة والمواد التراثية.' : 'Highest standards in choosing heritage fabrics and materials.' },
              { icon: Clock, title: locale === 'ar' ? 'التزام تام' : 'Full Commitment', desc: locale === 'ar' ? 'فريقنا يعمل على مدار الساعة لضمان جاهزية فعاليتكم في الموعد.' : 'Our team works around the clock to ensure your event is ready on time.' },
              { icon: TrendingUp, title: locale === 'ar' ? 'خدمات ملكية' : 'Royal Services', desc: locale === 'ar' ? 'من التصميم إلى التنفيذ، نقدم تجربة متكاملة لراحة ضيوفكم.' : 'From design to execution, we offer a full experience for your guests.' }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-3xl bg-gray-50 hover:bg-brand-yellow/10 transition-all duration-500 border border-transparent hover:border-brand-yellow">
                <div className="w-20 h-20 bg-brand-yellow rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-brand-yellow/10 group-hover:scale-110 transition-transform">
                  <f.icon className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-black mb-6 text-black tracking-tight">{f.title}</h3>
                <p className="text-black/50 font-medium leading-relaxed text-base">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Grid */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="space-y-4">
              <div className="text-black/30 font-black text-xs uppercase tracking-[0.5em]">{t.featuredSub}</div>
              <h2 className="text-6xl md:text-8xl font-black text-black tracking-tighter leading-none">{t.featuredTitle}</h2>
            </div>
            <Link to="/shop" className="group flex items-center gap-8 text-black font-black uppercase text-xs tracking-[0.3em] hover:text-brand-yellow transition-all">
              {locale === 'ar' ? 'تصفح الكتالوج' : 'Explore Catalog'}
              <div className="w-16 h-16 rounded-full border-2 border-black/10 flex items-center justify-center group-hover:bg-brand-yellow group-hover:border-brand-yellow transition-all">
                <ChevronRight className={`w-8 h-8 ${locale === 'ar' ? 'rotate-180' : ''}`} />
              </div>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {FEATURED_PRODUCTS.map((p) => (
              <div key={p.id} className="group bg-gray-50 rounded-[3rem] overflow-hidden border border-transparent hover:border-brand-yellow hover:-translate-y-4 transition-all duration-700">
                <Link to={`/product/${p.id}`} className="block relative aspect-square m-6 rounded-[2rem] bg-white overflow-hidden p-8">
                  <img 
                    src={p.img} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000"
                    alt={p.name_en}
                  />
                </Link>
                <div className="p-10 pt-4">
                  <h3 className="text-xl font-black text-black leading-tight mb-8">
                    {locale === 'ar' ? p.name_ar : p.name_en}
                  </h3>
                  <div className="flex items-center justify-between pt-8 border-t border-black/5">
                    <div className="text-3xl font-black text-black">
                      {p.price} <span className="text-[10px] text-black/30 font-bold uppercase tracking-widest">{t.currency}</span>
                    </div>
                    <Link 
                      to={`/product/${p.id}`}
                      className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center text-black shadow-lg shadow-brand-yellow/10"
                    >
                      <ChevronRight className={`w-6 h-6 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Black Anchor */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-12">
            {locale === 'ar' ? 'ابدأ تجهيز مناسبتك' : 'Elevate Your Event'}
          </h2>
          <p className="text-xl md:text-3xl text-white/40 font-bold mb-20 max-w-3xl mx-auto leading-relaxed">
            {locale === 'ar' 
              ? 'احجز معداتك الملكية الآن عبر تطبيق رحال. نضمن لك السرعة في التنفيذ والجودة في المنتج.' 
              : 'Book your royal equipment now via Rahal App. We guarantee speed in execution and quality in product.'}
          </p>
          <div className="flex flex-wrap justify-center gap-10">
             <Link to="/shop" className="bg-brand-yellow text-black px-16 py-8 rounded-3xl font-black text-2xl hover:scale-105 transition-all shadow-2xl">
               {locale === 'ar' ? 'ابدأ الطلب' : 'Order Now'}
             </Link>
             <Link to="/contact" className="bg-white/10 text-white px-16 py-8 rounded-3xl font-black text-2xl hover:bg-white hover:text-black transition-all">
               {t.contact}
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
