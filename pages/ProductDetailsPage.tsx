
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Palette, 
  Box, 
  Loader2, 
  Info, 
  Layers, 
  Maximize2, 
  Repeat, 
  LayoutGrid,
  Share2,
  Heart
} from 'lucide-react';
import { supabase } from '../supabase';

const COLOR_MAP: Record<string, string> = {
  'White': '#FFFFFF',
  'Black': '#1A1A1A',
  'Red': '#C41E3A',
  'Maroon': '#800000',
  'Beige': '#F5F5DC',
  'Gold': '#FFD700',
  'Green': '#006B3C',
  'Navy': '#000080',
  'Brown': '#5C4033',
  'Silver': '#C0C0C0',
};

const ProductDetailsPage: React.FC<{ t: any, locale: string, onAddToCart: (item: any) => void }> = ({ t, locale, onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`*, sizes:product_sizes(*), colors:product_colors(*)`)
          .eq('id', id)
          .single();

        if (data) {
          setProduct(data);
          setSelectedSize(data.sizes?.[0]);
          setSelectedColor(data.colors?.[0]?.name_en);
        } else {
          // Fallback demo product with more images for carousel testing
          const mock = {
            id: 'arabic-ground-majlis',
            name_ar: 'جلسة أرضية عربية تراثية - تصميم ملكي',
            name_en: 'Royal Arabic Ground Majlis - Traditional Design',
            category: 'Seating',
            colors: [{ name_en: 'Maroon' }, { name_en: 'Red' }],
            sizes: [{ id: 's1', name_ar: '٤ أشخاص', name_en: '4 People', price_modifier: 0 }],
            base_price: 18.0,
            image_url: 'https://app.rahaltent.com/wp-content/uploads/2024/07/app-2.png',
            gallery: [
              'https://app.rahaltent.com/wp-content/uploads/2024/07/app-2.png',
              'http://app.rahaltent.com/wp-content/uploads/2025/02/1.png',
              'https://app.rahaltent.com/wp-content/uploads/2024/07/280.png'
            ],
            description_ar: 'جلسة أرضية فاخرة مستوحاة من التراث العربي الأصيل لتجربة عربية خالصة.',
            description_en: 'Luxury ground seating inspired by pure Arabic heritage for an authentic experience.',
            specs: { pieces: 4, total_dimensions: '3x3m', material_en: 'Velvet & Sadu', material_ar: 'مخمل وسدو' }
          };
          setProduct(mock);
          setSelectedSize(mock.sizes[0]);
          setSelectedColor(mock.colors[0].name_en);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    return product.gallery?.length ? product.gallery : [product.image_url];
  }, [product]);

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  // Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    if (diff > 50) {
      nextImage();
      setTouchStart(null);
    } else if (diff < -50) {
      prevImage();
      setTouchStart(null);
    }
  };

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return (product.base_price || 0) + (selectedSize?.price_modifier || 0);
  }, [product, selectedSize]);

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      alert(locale === 'ar' ? 'يرجى اختيار التواريخ' : 'Please select dates');
      return;
    }
    onAddToCart({
      id: Math.random().toString(36).substr(2, 9),
      product_id: product.id,
      product_name_ar: product.name_ar,
      product_name_en: product.name_en,
      product_image: product.image_url,
      size_name: locale === 'ar' ? selectedSize?.name_ar : selectedSize?.name_en,
      color: selectedColor,
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice,
    });
    navigate('/cart');
  };

  const renderSpecs = () => {
    if (!product || !product.specs) return null;
    const { specs, category } = product;
    const cat = category.toLowerCase();

    return (
      <div className="bg-white border-2 border-black/5 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/40 flex items-center gap-3">
          <Info className="w-4 h-4 text-black" /> {t.specifications}
        </h3>
        <div className="grid grid-cols-2 gap-8">
          {cat.includes('tent') && (
            <>
              <div className="space-y-2">
                <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">{locale === 'ar' ? 'الأبعاد' : 'Dimensions'}</p>
                <p className="text-black font-black text-lg flex items-center gap-2"><Maximize2 className="w-4 h-4 text-black" /> {specs.dimensions || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">{locale === 'ar' ? 'عدد الطبقات' : 'Layers'}</p>
                <p className="text-black font-black text-lg flex items-center gap-2"><Layers className="w-4 h-4 text-black" /> {specs.layers || 1}</p>
              </div>
            </>
          )}
          {cat.includes('chair') && (
            <div className="space-y-2 col-span-2">
              <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">{locale === 'ar' ? 'قابلية الطي' : 'Foldability'}</p>
              <p className="text-black font-black text-lg flex items-center gap-2">
                <Repeat className="w-4 h-4 text-black" /> 
                {specs.foldable ? (locale === 'ar' ? 'قابل للطي' : 'Foldable Asset') : (locale === 'ar' ? 'غير قابل للطي' : 'Fixed Structure')}
              </p>
            </div>
          )}
          {(cat.includes('seat') || cat.includes('majlis')) && (
            <>
              <div className="space-y-2">
                <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">{locale === 'ar' ? 'عدد القطع' : 'Pieces'}</p>
                <p className="text-black font-black text-lg flex items-center gap-2"><LayoutGrid className="w-4 h-4 text-black" /> {specs.pieces || 0}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">{locale === 'ar' ? 'المساحة الكلية' : 'Total Coverage'}</p>
                <p className="text-black font-black text-lg flex items-center gap-2"><Maximize2 className="w-4 h-4 text-black" /> {specs.total_dimensions || 'N/A'}</p>
              </div>
            </>
          )}
          <div className="space-y-2 col-span-2 pt-4 border-t border-black/5">
            <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">{locale === 'ar' ? 'المادة المستخدمة' : 'Primary Material'}</p>
            <p className="text-black font-black text-lg">{locale === 'ar' ? specs.material_ar : specs.material_en}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-yellow"><Loader2 className="w-16 h-16 text-black animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in bg-brand-yellow">
      <div className="flex justify-between items-center mb-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-4 text-black/60 hover:text-black transition-all group">
          <div className="w-12 h-12 rounded-2xl border-2 border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-brand-yellow transition-all">
            <ChevronLeft className={`w-6 h-6 ${locale === 'ar' ? 'rotate-180' : ''}`} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">{locale === 'ar' ? 'العودة للمتجر' : 'Back to Inventory'}</span>
        </button>
        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-2xl border-2 border-black/10 flex items-center justify-center hover:bg-black hover:text-brand-yellow transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-2xl border-2 border-black/10 flex items-center justify-center hover:bg-black hover:text-brand-yellow transition-all">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Carousel Section */}
        <div className="w-full lg:w-1/2 space-y-10">
          <div 
            className="group relative aspect-square bg-white rounded-[3.5rem] border-2 border-black/5 overflow-hidden flex items-center justify-center shadow-2xl"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
          >
            {/* Main Carousel View */}
            <div className="w-full h-full relative p-12">
              {gallery.map((img: string, idx: number) => (
                <img 
                  key={idx}
                  src={img} 
                  className={`absolute inset-0 w-full h-full object-contain p-12 transition-all duration-700 ease-in-out ${activeImageIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  alt={`Product View ${idx + 1}`}
                />
              ))}
            </div>

            {/* Carousel Navigation */}
            {gallery.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/5 hover:bg-black text-black hover:text-brand-yellow rounded-2xl backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
                >
                  <ChevronLeft className={`w-8 h-8 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/5 hover:bg-black text-black hover:text-brand-yellow rounded-2xl backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
                >
                  <ChevronRight className={`w-8 h-8 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute top-10 right-10 bg-black text-brand-yellow px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest z-20 shadow-xl">
              {activeImageIndex + 1} / {gallery.length}
            </div>

            {/* Swipe Indicator (Mobile) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {gallery.map((_: any, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImageIndex(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${activeImageIndex === i ? 'bg-black w-14' : 'bg-black/10 w-2 hover:bg-black/20'}`}
                ></button>
              ))}
            </div>
          </div>
          
          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {gallery.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-28 h-28 rounded-3xl border-4 shrink-0 transition-all overflow-hidden bg-white p-4 ${activeImageIndex === idx ? 'border-black shadow-lg scale-105' : 'border-black/5 opacity-50'}`}
                >
                  <img src={img} className="w-full h-full object-contain" alt="" />
                </button>
              ))}
            </div>
          )}

          <div className="p-8 rounded-[2.5rem] bg-black text-brand-yellow flex items-center gap-6 shadow-2xl">
             <div className="w-16 h-16 bg-brand-yellow/10 rounded-2xl flex items-center justify-center text-brand-yellow border border-brand-yellow/20">
               <ShieldCheck className="w-9 h-9" />
             </div>
             <div>
               <div className="text-base font-black uppercase tracking-tight">{locale === 'ar' ? 'ضمان التميز من رحال' : 'Rahal Excellence Guarantee'}</div>
               <div className="text-brand-yellow/60 text-xs font-bold">{locale === 'ar' ? 'تركيب احترافي وفحص شامل لكافة المعدات' : 'Professional setup and full inspection of all gear'}</div>
             </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 space-y-12">
          <div className="space-y-6">
            <div className="inline-block bg-black text-brand-yellow px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
              {product.category} COLLECTION
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tighter leading-[0.85]">
              {locale === 'ar' ? product.name_ar : product.name_en}
            </h1>
            <p className="text-xl text-black/60 font-bold leading-relaxed max-w-xl">
              {locale === 'ar' ? product.description_ar : product.description_en}
            </p>
          </div>

          {renderSpecs()}

          <div className="space-y-12">
            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 flex items-center gap-4">
                <Palette className="w-5 h-5 text-black" /> {t.selectColor}
              </label>
              <div className="flex flex-wrap gap-5">
                {product.colors?.map((c: any) => (
                  <button 
                    key={c.name_en} 
                    onClick={() => setSelectedColor(c.name_en)}
                    className={`w-16 h-16 rounded-[1.8rem] border-4 transition-all flex items-center justify-center shadow-xl ${selectedColor === c.name_en ? 'border-black scale-110' : 'border-white/50'}`}
                    style={{ backgroundColor: COLOR_MAP[c.name_en] || '#444' }}
                  >
                    {selectedColor === c.name_en && <Check className={`w-8 h-8 ${['White', 'Silver', 'Beige'].includes(c.name_en) ? 'text-black' : 'text-white'}`} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 flex items-center gap-4">
                <Box className="w-5 h-5 text-black" /> {t.selectSize}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {product.sizes?.map((s: any) => (
                  <button 
                    key={s.id} 
                    onClick={() => setSelectedSize(s)}
                    className={`p-8 rounded-[2.2rem] border-2 text-start transition-all flex justify-between items-center ${selectedSize?.id === s.id ? 'bg-black border-black text-brand-yellow shadow-2xl scale-[1.02]' : 'bg-white border-black/5 text-black hover:border-black/10'}`}
                  >
                    <span className="font-black text-lg">{locale === 'ar' ? s.name_ar : s.name_en}</span>
                    <span className={`text-sm font-black ${selectedSize?.id === s.id ? 'text-brand-yellow' : 'text-black/30'}`}>+{s.price_modifier} {t.currency}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 p-10 rounded-[3rem] bg-white border border-black/5 shadow-xl">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">{t.startDate}</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-black font-black text-base outline-none focus:border-black transition-all" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">{t.endDate}</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-black font-black text-base outline-none focus:border-black transition-all" />
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-12">
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-black/30">{t.totalPrice}</div>
              <div className="text-7xl font-black text-black tracking-tighter">
                {totalPrice.toFixed(1)} <span className="text-base font-bold text-black/40 uppercase tracking-widest">{t.currency}</span>
              </div>
            </div>
            <button 
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-20 py-8 bg-black text-brand-yellow rounded-[2.5rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.2)] flex items-center justify-center gap-6 group"
            >
              <ShoppingCart className="w-8 h-8 group-hover:-rotate-12 transition-transform" />
              {t.addToCart}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
