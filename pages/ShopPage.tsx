
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Package, Tag, RotateCcw, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

const CATEGORIES = [
  { id: 'HeritageTriple', ar: 'تعليقات أثرية ثلاثية', en: 'Triple Heritage' },
  { id: 'Heritage', ar: 'تعليقات أثرية', en: 'Heritage' },
  { id: 'GroundSeating', ar: 'جلسات أرضية', en: 'Ground Seating' },
  { id: 'ArabicTent', ar: 'خيمة عربية', en: 'Arabic Tents' },
  { id: 'Chairs', ar: 'كراسي', en: 'Chairs' },
  { id: 'AC', ar: 'مكيفات', en: 'AC Units' },
  { id: 'Misc', ar: 'متنوع', en: 'Miscellaneous' },
];

const MOCK_PRODUCTS = [
  { id: 'arabic-ground-majlis', name_ar: 'جلسة أرضية عربية تراثية', name_en: 'Traditional Arabic Majlis', category: 'GroundSeating', base_price: 18.0, image_url: 'https://app.rahaltent.com/wp-content/uploads/2024/07/app-2.png', listingType: 'rental' },
  { id: 'heritage-triple-hanging', name_ar: 'تعليقة تراثية ثلاثية فاخرة', name_en: 'Premium Triple Heritage', category: 'HeritageTriple', base_price: 12.5, image_url: 'https://app.rahaltent.com/wp-content/uploads/2024/07/280.png', listingType: 'sales' },
  { id: 'arabic-shadow-tent', name_ar: 'خيمة عربية ظلالاية', name_en: 'Arabic Shadow Tent', category: 'ArabicTent', base_price: 45.0, image_url: 'http://app.rahaltent.com/wp-content/uploads/2025/02/1.png', listingType: 'rental' },
  { id: 'chair-infinity-gold', name_ar: 'كرسي انفينيتي ذهبي', name_en: 'Gold Infinity Chair', category: 'Chairs', base_price: 2.0, image_url: 'http://app.rahaltent.com/wp-content/uploads/2024/06/25.png', listingType: 'rental' },
];

const ProductCard: React.FC<{ product: any, locale: string, t: any }> = ({ product, locale, t }) => {
  return (
    <div className="group bg-white rounded-[2.5rem] border border-black/5 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50 m-5 rounded-[2rem]">
        <img 
          src={product.image_url} 
          className="w-full h-full object-contain p-10 group-hover:scale-110 transition-transform duration-700" 
          alt={product.name_en} 
        />
        <div className="absolute top-5 right-5 bg-black text-brand-yellow px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">
          {product.listingType === 'rental' ? (locale === 'ar' ? 'تأجير' : 'Rental') : (locale === 'ar' ? 'بيع' : 'Sale')}
        </div>
      </Link>
      
      <div className="p-10 pt-2 flex-1 flex flex-col">
        <span className="text-[8px] font-black text-black/30 uppercase tracking-[0.3em] mb-4">
          {CATEGORIES.find(c => c.id === product.category)?.[locale] || product.category}
        </span>
        <Link to={`/product/${product.id}`} className="text-2xl font-black mb-8 block hover:text-brand-yellow transition-colors leading-tight tracking-tighter text-black line-clamp-2">
          {locale === 'ar' ? product.name_ar : product.name_en}
        </Link>
        <div className="flex items-center justify-between mt-auto pt-8 border-t border-black/5">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-black/30 uppercase tracking-widest">{t.basePrice}</span>
            <span className="text-3xl font-black text-black tracking-tighter">
              {(product.base_price || 0).toFixed(1)} <span className="text-xs font-bold text-black/40">{t.currency}</span>
            </span>
          </div>
          <Link 
            to={`/product/${product.id}`} 
            className="w-14 h-14 bg-brand-yellow text-black rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-brand-yellow/10 hover:bg-black hover:text-brand-yellow"
          >
            <ChevronRight className={`w-7 h-7 ${locale === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ShopPage: React.FC<{ t: any, locale: string }> = ({ t, locale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      if (!supabase) {
        setProducts(MOCK_PRODUCTS);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data?.length ? data : MOCK_PRODUCTS);
      } catch (err) {
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = locale === 'ar' ? p.name_ar : p.name_en;
      const matchesSearch = name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, selectedCategory, locale]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter text-black">{t.shop}</h1>
          <div className="flex items-center gap-4 text-black/40">
            <Package className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">{filteredProducts.length} Premium Items Found</span>
          </div>
        </div>
        
        <div className="relative w-full md:w-[500px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
          <input 
            type="text" 
            placeholder={locale === 'ar' ? 'ابحث عن المعدات الملكية...' : 'Search royal gear...'}
            className="w-full bg-white border-2 border-black/5 rounded-3xl py-6 pl-16 pr-8 font-bold text-lg text-black focus:border-black outline-none transition-all shadow-xl shadow-black/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-12 shrink-0">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-10 flex items-center gap-4">
              <Tag className="w-4 h-4 text-brand-yellow" /> {t.categories}
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-start px-6 py-4 rounded-2xl text-sm font-black transition-all ${selectedCategory === 'all' ? 'bg-black text-brand-yellow' : 'text-black/50 hover:bg-gray-50'}`}
              >
                {t.allProducts}
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-start px-6 py-4 rounded-2xl text-sm font-black transition-all ${selectedCategory === cat.id ? 'bg-black text-brand-yellow' : 'text-black/50 hover:bg-gray-50'}`}
                >
                  {locale === 'ar' ? cat.ar : cat.en}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="w-full py-5 border-2 border-black/5 rounded-3xl flex items-center justify-center gap-4 text-black/40 hover:text-black hover:bg-white transition-all text-xs font-black uppercase tracking-[0.2em]"
          >
            <RotateCcw className="w-5 h-5" /> Reset Filters
          </button>
        </aside>

        {/* Grid Area */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-32"><Loader2 className="w-16 h-16 text-black/10 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} locale={locale} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
