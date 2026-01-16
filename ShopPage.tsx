
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronRight, Package, Grid, LayoutGrid, Loader2, X, RotateCcw, Tag, DollarSign, ChevronLeft } from 'lucide-react';
import { supabase } from '../supabase';

const CATEGORIES = [
  { id: 'HeritageTriple', ar: 'تعليقات أثرية ثلاثية', en: 'Triple Heritage Hangings' },
  { id: 'Heritage', ar: 'تعليقات أثرية', en: 'Heritage Hangings' },
  { id: 'GroundSeating', ar: 'جلسات أرضية', en: 'Ground Seating' },
  { id: 'ArabicTent', ar: 'خيمة عربية ظلالاية', en: 'Arabic Shadow Tents' },
  { id: 'Chairs', ar: 'كراسي', en: 'Chairs' },
  { id: 'Stage', ar: 'مسرح', en: 'Stages' },
  { id: 'AC', ar: 'مكيفات', en: 'Air Conditioning' },
  { id: 'Generators', ar: 'مولدات', en: 'Generators' },
  { id: 'Misc', ar: 'متنوع', en: 'Miscellaneous' },
];

const MOCK_PRODUCTS = [
  {
    id: 'arabic-ground-majlis',
    name_ar: 'جلسة أرضية عربية تراثية - تصميم سدو كامل',
    name_en: 'Traditional Arabic Ground Majlis - Full Sadu Design',
    category: 'GroundSeating',
    base_price: 18.0,
    image_url: 'https://app.rahaltent.com/wp-content/uploads/2024/07/app-2.png',
    gallery: [
      'https://app.rahaltent.com/wp-content/uploads/2024/07/app-2.png',
      'http://app.rahaltent.com/wp-content/uploads/2025/02/1.png'
    ],
    hasVariants: true,
    listingType: 'rental'
  },
  {
    id: 'heritage-triple-hanging',
    name_ar: 'تعليقة تراثية ثلاثية فاخرة - تصميم أصيل',
    name_en: 'Premium Triple Heritage Hanging - Authentic Design',
    category: 'HeritageTriple',
    base_price: 12.5,
    image_url: 'https://app.rahaltent.com/wp-content/uploads/2024/07/280.png',
    gallery: [
      'https://app.rahaltent.com/wp-content/uploads/2024/07/280.png',
      'https://app.rahaltent.com/wp-content/uploads/2024/07/317.png'
    ],
    hasVariants: true,
    listingType: 'sales'
  },
  {
    id: 'arabic-shadow-tent',
    name_ar: 'خيمة عربية ظلالاية - نقش سدو تراثي',
    name_en: 'Arabic Shadow Tent - Traditional Sadu Pattern',
    category: 'ArabicTent',
    base_price: 45.0,
    image_url: 'http://app.rahaltent.com/wp-content/uploads/2025/02/1.png',
    gallery: [
      'http://app.rahaltent.com/wp-content/uploads/2025/02/1.png',
      'https://app.rahaltent.com/wp-content/uploads/2024/07/103.png'
    ],
    hasVariants: true,
    listingType: 'rental'
  },
  {
    id: 'heritage-hanging-1x1',
    name_ar: 'تعليقة زينة تراثية - مقاس 1*1 متر',
    name_en: 'Heritage Decorative Hanging - 1x1 MTR',
    category: 'Heritage',
    base_price: 2.5,
    image_url: 'https://app.rahaltent.com/wp-content/uploads/2024/07/317.png',
    gallery: [
      'https://app.rahaltent.com/wp-content/uploads/2024/07/317.png'
    ],
    hasVariants: true,
    listingType: 'sales'
  },
  {
    id: 'chair-infinity-gold',
    name_ar: 'كرسي انفينيتي ذهبي فاخر - للمناسبات الملكية',
    name_en: 'Luxury Gold Infinity Event Chair - Royal Events',
    category: 'Chairs',
    base_price: 2.0,
    image_url: 'http://app.rahaltent.com/wp-content/uploads/2024/06/25.png',
    gallery: [
      'http://app.rahaltent.com/wp-content/uploads/2024/06/25.png',
      'http://app.rahaltent.com/wp-content/uploads/2024/06/19.png'
    ],
    hasVariants: true,
    listingType: 'rental'
  },
  {
    id: 'ac-column-pro',
    name_ar: 'مكيف عمودي احترافي - قدرة تبريد فائقة',
    name_en: 'Professional Column AC - High Cooling Capacity',
    category: 'AC',
    base_price: 35.0,
    image_url: 'https://app.rahaltent.com/wp-content/uploads/2024/07/115.png',
    gallery: [
      'https://app.rahaltent.com/wp-content/uploads/2024/07/115.png'
    ],
    hasVariants: true,
    listingType: 'rental'
  },
  {
    id: 'generator-silent-pro',
    name_ar: 'مولد كهربائي صامت احترافي - قدرات عالية',
    name_en: 'Professional Silent Power Generator - High Capacity',
    category: 'Generators',
    base_price: 50.0,
    image_url: 'https://app.rahaltent.com/wp-content/uploads/2024/07/20.png',
    gallery: [
      'https://app.rahaltent.com/wp-content/uploads/2024/07/20.png'
    ],
    hasVariants: true,
    listingType: 'rental'
  },
  {
    id: 'outdoor-pyramid-heater',
    name_ar: 'دفاية هرمية خارجية - غاز متطور',
    name_en: 'Outdoor Pyramid Gas Heater - Advanced Model',
    category: 'Misc',
    base_price: 15.0,
    image_url: 'https://app.rahaltent.com/wp-content/uploads/2024/07/35.png',
    gallery: [
      'https://app.rahaltent.com/wp-content/uploads/2024/07/35.png'
    ],
    hasVariants: true,
    listingType: 'rental'
  }
];

const ProductCard: React.FC<{ product: any, locale: string, t: any }> = ({ product, locale, t }) => {
  const images = useMemo(() => {
    return product.gallery && product.gallery.length > 0 ? product.gallery : [product.image_url];
  }, [product]);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Cycles every 4 seconds
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="group bg-[#1a1c1e] rounded-[3.5rem] border border-[#2a2d31] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] transition-all duration-700 flex flex-col hover:-translate-y-2">
      <Link to={`/product/${product.id}`} className="block relative h-80 overflow-hidden bg-[#0f1113] m-5 rounded-[2.5rem]">
        <div className="w-full h-full relative">
          {images.map((img: string, idx: number) => (
            <img 
              key={idx}
              src={img} 
              className={`absolute inset-0 w-full h-full object-contain p-12 transition-opacity duration-1000 ${currentImgIndex === idx ? 'opacity-100' : 'opacity-0'}`} 
              alt={product.name_en} 
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600/1a1c1e/ffffff?text=Image+Coming+Soon'; }}
            />
          ))}
        </div>
        
        {/* Gallery Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_: any, i: number) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${currentImgIndex === i ? 'w-6 bg-brand-yellow' : 'w-1.5 bg-white/20'}`}></div>
            ))}
          </div>
        )}

        <div className="absolute top-6 right-6 bg-brand-yellow text-black px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl z-10">
          {product.listingType === 'rental' ? (locale === 'ar' ? 'تأجير' : 'Rental') : (locale === 'ar' ? 'للبيع' : 'Sales')}
        </div>
      </Link>
      
      <div className="p-10 pt-4 flex-1 flex flex-col">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">
          {CATEGORIES.find(c => c.id === product.category)?.[locale] || product.category}
        </span>
        <Link to={`/product/${product.id}`} className="text-3xl font-black mb-8 block hover:text-brand-yellow transition-colors leading-[1.2] flex-1 tracking-tighter text-white">
          {locale === 'ar' ? product.name_ar : product.name_en}
        </Link>
        <div className="flex items-center justify-between border-t border-[#2a2d31] pt-10">
          <span className="text-4xl font-black text-white tracking-tighter">
            {(product.base_price || 0).toFixed(1)} <span className="text-sm font-bold text-gray-500">{t.currency}</span>
          </span>
          <Link 
            to={`/product/${product.id}`} 
            className="w-16 h-16 bg-black text-white rounded-[1.8rem] flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-all shadow-xl border border-[#2a2d31]"
          >
            <ChevronRight className={`w-8 h-8 ${locale === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ShopPage: React.FC<{ t: any, locale: string }> = ({ t, locale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [listingType, setListingType] = useState<'all' | 'rental' | 'sales'>('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      if (!supabase) {
        setProducts(MOCK_PRODUCTS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const dbProducts = data || [];
        const combined = [...MOCK_PRODUCTS, ...dbProducts.map(p => ({
          ...p, 
          listingType: p.listingType || 'rental',
          gallery: p.gallery || []
        }))];
        
        // De-duplicate by ID
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        setProducts(unique);
      } catch (err) {
        console.error("Supabase fetch failed:", err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = locale === 'ar' ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar);
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesPrice = (p.base_price || 0) >= priceRange[0] && (p.base_price || 0) <= priceRange[1];
      const matchesType = listingType === 'all' || p.listingType === listingType;
      return matchesSearch && matchesCat && matchesPrice && matchesType;
    });
  }, [products, searchTerm, selectedCategory, priceRange, listingType, locale]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 500]);
    setListingType('all');
  };

  const FilterSidebar = () => (
    <div className="space-y-12">
      <div className="group relative">
        <input 
          type="text"
          placeholder={locale === 'ar' ? 'ابحث عن المعدات...' : 'Search equipment...'}
          className="w-full bg-[#1a1c1e] border-2 border-[#2a2d31] rounded-[2rem] px-8 py-5 outline-none focus:border-brand-yellow transition-all font-bold text-lg shadow-xl text-white placeholder:text-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className={`absolute top-1/2 -translate-y-1/2 ${locale === 'ar' ? 'left-8' : 'right-8'} text-gray-500 group-focus-within:text-brand-yellow transition-colors`} />
      </div>

      <div className="bg-[#1a1c1e] p-10 rounded-[3rem] border border-[#2a2d31] shadow-2xl">
        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 mb-8 flex items-center gap-4">
          <Tag className="w-5 h-5 text-brand-yellow" />
          {locale === 'ar' ? 'نوع الخدمة' : 'Service Type'}
        </h3>
        <div className="flex bg-[#0f1113] p-2 rounded-2xl gap-2 border border-[#2a2d31]">
          {(['all', 'rental', 'sales'] as const).map(type => (
            <button
              key={type}
              onClick={() => setListingType(type)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${listingType === type ? 'bg-brand-yellow text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              {type === 'all' ? (locale === 'ar' ? 'الكل' : 'All') : 
               type === 'rental' ? (locale === 'ar' ? 'تأجير' : 'Rental') : 
               (locale === 'ar' ? 'بيع' : 'Sales')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1c1e] p-10 rounded-[3rem] border border-[#2a2d31] shadow-2xl">
        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 mb-8 flex items-center gap-4">
          <LayoutGrid className="w-5 h-5 text-brand-yellow" />
          {t.categories}
        </h3>
        <div className="space-y-3">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-start px-7 py-4 rounded-[1.5rem] transition-all font-black text-xs flex items-center justify-between group ${selectedCategory === 'all' ? 'bg-brand-yellow text-black shadow-lg' : 'text-gray-500 hover:bg-[#0f1113]'}`}
          >
            <span>{t.allProducts}</span>
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-start px-7 py-4 rounded-[1.5rem] transition-all font-black text-xs flex items-center justify-between group ${selectedCategory === cat.id ? 'bg-brand-yellow text-black shadow-lg' : 'text-gray-500 hover:bg-[#0f1113]'}`}
            >
              <span className="flex-1">{locale === 'ar' ? cat.ar : cat.en}</span>
              {selectedCategory === cat.id && <ChevronRight className={`w-4 h-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1c1e] p-10 rounded-[3rem] border border-[#2a2d31] shadow-2xl">
        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 mb-8 flex items-center gap-4">
          <DollarSign className="w-5 h-5 text-brand-yellow" />
          {locale === 'ar' ? 'نطاق السعر' : 'Price Range'}
        </h3>
        <div className="space-y-8">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="bg-[#0f1113] px-4 py-2 rounded-xl border border-[#2a2d31] text-white">{priceRange[0]} {t.currency}</span>
            <div className="w-4 h-px bg-[#2a2d31]"></div>
            <span className="bg-[#0f1113] px-4 py-2 rounded-xl border border-[#2a2d31] text-white">{priceRange[1]} {t.currency}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="500" 
            step="5"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-[#0f1113] rounded-lg appearance-none cursor-pointer accent-brand-yellow"
          />
        </div>
      </div>

      <button 
        onClick={resetFilters}
        className="w-full flex items-center justify-center gap-3 py-6 bg-[#1a1c1e] text-gray-500 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black hover:text-white transition-all group border border-[#2a2d31]"
      >
        <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
        {locale === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700 bg-[#0f1113]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h1 className="text-6xl font-black mb-4 tracking-tighter text-white">{t.shop}</h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">
            {locale === 'ar' ? 'تجهيزات احترافية لكافة المناسبات' : 'Professional Equipment for All Events'}
          </p>
        </div>
        <button 
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden flex items-center gap-3 bg-[#1a1c1e] border border-[#2a2d31] px-8 py-4 rounded-2xl shadow-xl font-black uppercase text-[10px] tracking-widest text-white"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {locale === 'ar' ? 'الفلاتر' : 'Filters'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-[100] flex items-end animate-in fade-in">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
             <div className="relative w-full bg-[#1a1c1e] rounded-t-[3rem] p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-12">
               <div className="flex justify-between items-center mb-10">
                 <h2 className="text-3xl font-black text-white">{locale === 'ar' ? 'الفلاتر' : 'Filters'}</h2>
                 <button onClick={() => setShowMobileFilters(false)} className="p-4 bg-[#0f1113] rounded-full text-white"><X className="w-6 h-6" /></button>
               </div>
               <FilterSidebar />
               <button onClick={() => setShowMobileFilters(false)} className="w-full mt-10 bg-brand-yellow text-black py-6 rounded-3xl font-black text-xl">{locale === 'ar' ? 'عرض النتائج' : 'View Results'}</button>
             </div>
          </div>
        )}

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 bg-[#1a1c1e] p-8 rounded-[2.5rem] border border-[#2a2d31] shadow-2xl gap-6">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#0f1113] rounded-2xl flex items-center justify-center font-black text-2xl text-brand-yellow shadow-inner">
                  {filteredProducts.length}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block">Catalog Volume</span>
                  <span className="text-sm font-black text-white">{locale === 'ar' ? 'معدات مطابقة للبحث' : 'Matching Equipment'}</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
            {loading ? (
               [1,2,3,4,5,6].map(i => (
                 <div key={i} className="bg-[#1a1c1e] rounded-[3.5rem] border border-[#2a2d31] p-8 space-y-8 animate-pulse">
                   <div className="aspect-square bg-[#0f1113] rounded-[2.5rem]"></div>
                 </div>
               ))
            ) : (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} locale={locale} t={t} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
