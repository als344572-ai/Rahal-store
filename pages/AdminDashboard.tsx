
import React, { useState, useRef, useEffect } from 'react';
import { 
  Package, 
  CalendarDays, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Activity, 
  X, 
  TrendingUp, 
  Upload, 
  Layers, 
  Check, 
  RefreshCw, 
  FileText,
  Maximize2,
  LayoutGrid,
  Repeat,
  Settings
} from 'lucide-react';
import { supabase } from '../supabase';

interface SizeVariant {
  id: string;
  nameEn: string;
  nameAr: string;
  modifier: number;
}

interface ColorVariant {
  id: string;
  nameEn: string;
  nameAr: string;
  hex: string;
}

const AdminDashboard: React.FC<{ t: any, locale: string }> = ({ t, locale }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'bookings'>('stats');
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    category: 'Tent',
    basePrice: 0,
    sizes: [] as SizeVariant[],
    colors: [] as ColorVariant[],
    specs: {
      dimensions: '',
      layers: 1,
      foldable: false,
      pieces: 1,
      total_dimensions: '',
      material_en: '',
      material_ar: ''
    }
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const stats = [
    { label: t.revenue, value: `12,450.00 ${t.currency}`, icon: DollarSign, color: 'bg-green-500', trend: '+12.5%' },
    { label: t.totalBookings, value: '142', icon: CalendarDays, color: 'bg-blue-500', trend: '+8.2%' },
    { label: locale === 'ar' ? 'تأجيرات نشطة' : 'Active Rentals', value: '18', icon: Activity, color: 'bg-rose-500', trend: '+2' },
    { label: locale === 'ar' ? 'نمو الأصول' : 'Asset Growth', value: '+14%', icon: TrendingUp, color: 'bg-amber-500', trend: '+5' },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return alert("Database not connected");

    setIsUploading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('products').upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
        imageUrl = publicUrl;
      }

      const { data: product, error: pErr } = await supabase.from('products').insert({
        name_en: newProduct.nameEn,
        name_ar: newProduct.nameAr,
        description_en: newProduct.descriptionEn,
        description_ar: newProduct.descriptionAr,
        category: newProduct.category,
        base_price: newProduct.basePrice,
        image_url: imageUrl,
        specs: newProduct.specs
      }).select().single();

      if (pErr) throw pErr;

      // Add Variants if any
      alert("Product Published Successfully!");
      setShowAddModal(false);
      setNewProduct({
        nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '',
        category: 'Tent', basePrice: 0, sizes: [], colors: [],
        specs: { dimensions: '', layers: 1, foldable: false, pieces: 1, total_dimensions: '', material_en: '', material_ar: '' }
      });
      setImagePreview(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const renderDynamicSpecForm = () => {
    const cat = newProduct.category.toLowerCase();
    return (
      <div className="space-y-8 bg-gray-50/50 p-12 rounded-[3.5rem] border border-gray-100 shadow-inner">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <h4 className="text-xl font-black flex items-center gap-3 text-gray-900">
            <Settings className="w-5 h-5 text-brand-yellow" /> 
            {locale === 'ar' ? 'المواصفات الفنية' : "Technical Parameters (Jason's Formula)"}
          </h4>
          <span className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">{newProduct.category} Mode</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {cat.includes('tent') && (
            <>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2"><Maximize2 className="w-3 h-3"/> {locale === 'ar' ? 'الأبعاد (طول x عرض)' : 'Dimensions (LxW)'}</label>
                <input type="text" className="w-full bg-white border border-gray-100 rounded-2xl p-5 font-bold outline-none focus:border-brand-yellow transition-all" placeholder="e.g. 10m x 20m" value={newProduct.specs.dimensions} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, dimensions: e.target.value}})} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2"><Layers className="w-3 h-3"/> {locale === 'ar' ? 'عدد الطبقات' : 'Number of Layers'}</label>
                <input type="number" className="w-full bg-white border border-gray-100 rounded-2xl p-5 font-bold outline-none focus:border-brand-yellow transition-all" value={newProduct.specs.layers} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, layers: parseInt(e.target.value) || 1}})} />
              </div>
            </>
          )}

          {cat.includes('chair') && (
            <div className="col-span-2 flex items-center gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={newProduct.specs.foldable} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, foldable: e.target.checked}})} />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-yellow"></div>
                <span className={`ml-4 text-sm font-black uppercase tracking-widest ${newProduct.specs.foldable ? 'text-black' : 'text-gray-300'}`}>
                  {locale === 'ar' ? 'قابل للطي' : 'Foldable Asset'}
                </span>
              </div>
            </div>
          )}

          {(cat.includes('seat') || cat.includes('majlis')) && (
            <>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2"><LayoutGrid className="w-3 h-3"/> {locale === 'ar' ? 'عدد القطع' : 'Number of Pieces'}</label>
                <input type="number" className="w-full bg-white border border-gray-100 rounded-2xl p-5 font-bold outline-none focus:border-brand-yellow transition-all" value={newProduct.specs.pieces} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, pieces: parseInt(e.target.value) || 1}})} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2"><Maximize2 className="w-3 h-3"/> {locale === 'ar' ? 'الأبعاد الإجمالية' : 'Total Coverage Area'}</label>
                <input type="text" className="w-full bg-white border border-gray-100 rounded-2xl p-5 font-bold outline-none focus:border-brand-yellow transition-all" placeholder="e.g. 5x5m Coverage" value={newProduct.specs.total_dimensions} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, total_dimensions: e.target.value}})} />
              </div>
            </>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-400">Material (English)</label>
            <input type="text" className="w-full bg-white border border-gray-100 rounded-2xl p-5 font-bold outline-none focus:border-brand-yellow transition-all" placeholder="e.g. Heavy Duty PVC" value={newProduct.specs.material_en} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, material_en: e.target.value}})} />
          </div>
          <div className="space-y-3 text-end">
            <label className="text-[10px] font-black uppercase text-gray-400">المادة (عربي)</label>
            <input type="text" className="w-full bg-white border border-gray-100 rounded-2xl p-5 font-bold outline-none focus:border-brand-yellow transition-all text-end" placeholder="مثال: بي في سي عالي التحمل" value={newProduct.specs.material_ar} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, material_ar: e.target.value}})} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in bg-[#f8fafc]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-20">
        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tighter text-gray-900">{t.dashboard}</h1>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Active Session: Executive Level</p>
          </div>
        </div>
        <div className="flex bg-white p-2.5 rounded-3xl border border-gray-100 shadow-2xl">
          {(['stats', 'products', 'bookings'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}>
              {tab === 'stats' ? (locale === 'ar' ? 'التحليلات' : 'Analytics') : tab === 'products' ? t.manageProducts : t.manageBookings}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-gray-50 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-2">{stat.label}</p>
              <h4 className="text-4xl font-black tracking-tighter text-gray-900">{stat.value}</h4>
              <div className="mt-6 flex items-center gap-2">
                <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1.5 rounded-xl">{stat.trend}</span>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">since last period</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in">
          <div className="p-12 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-8">
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{t.manageProducts}</h3>
            <button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto bg-brand-yellow text-black px-12 py-6 rounded-[2rem] font-black flex items-center justify-center gap-4 shadow-2xl shadow-brand-yellow/20 hover:scale-105 transition-all">
              <Plus className="w-6 h-6" /> {t.addNew}
            </button>
          </div>
          <div className="p-32 text-center text-gray-300">
            <Package className="w-24 h-24 mx-auto mb-6 opacity-5" />
            <p className="font-black uppercase tracking-widest text-xs">Awaiting Database Query Response...</p>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowAddModal(false)}></div>
          <div className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-[4rem] p-12 sm:p-16 overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setShowAddModal(false)} className="absolute top-12 right-12 p-5 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"><X className="w-6 h-6" /></button>
            
            <div className="mb-16">
              <h2 className="text-5xl font-black tracking-tighter text-gray-900">{locale === 'ar' ? 'إضافة أصل تجاري جديد' : 'Provision New Business Asset'}</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-3">All fields are audited for catalog consistency</p>
            </div>
            
            <form onSubmit={handleSave} className="space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-5">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-gray-50 border-4 border-dashed border-gray-100 rounded-[3.5rem] flex flex-col items-center justify-center gap-5 cursor-pointer hover:border-brand-yellow hover:bg-white transition-all group relative overflow-hidden shadow-inner"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} className="absolute inset-0 w-full h-full object-contain p-12" alt="Preview" />
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Upload className="w-10 h-10 text-brand-yellow" />
                        </div>
                        <div className="text-center">
                          <span className="block text-sm font-black uppercase text-gray-900">Upload Visual Asset</span>
                          <span className="block text-[10px] font-bold text-gray-400 mt-1 uppercase">PNG, JPG, WEBP (Max 5MB)</span>
                        </div>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) { setImageFile(f); const r = new FileReader(); r.onload = () => setImagePreview(r.result as string); r.readAsDataURL(f); }
                    }} />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 px-3 tracking-widest">Asset Name (EN)</label>
                      <input type="text" required className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-6 font-black text-lg focus:bg-white focus:border-brand-yellow outline-none transition-all" placeholder="e.g. Sadu Elite Majlis" value={newProduct.nameEn} onChange={e => setNewProduct({...newProduct, nameEn: e.target.value})} />
                    </div>
                    <div className="space-y-3 text-end">
                      <label className="text-[10px] font-black uppercase text-gray-400 px-3 tracking-widest">اسم الأصل (عربي)</label>
                      <input type="text" required className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-6 font-black text-lg focus:bg-white focus:border-brand-yellow outline-none transition-all text-end" placeholder="مثال: مجلس سدو ملكي" value={newProduct.nameAr} onChange={e => setNewProduct({...newProduct, nameAr: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 px-3 tracking-widest">Functional Category</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-6 font-black text-lg outline-none appearance-none focus:bg-white focus:border-brand-yellow cursor-pointer" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                        <option value="Tent">Tent (Large Structures)</option>
                        <option value="Chair">Chair (Seating Assets)</option>
                        <option value="Seating">Seating / Majlis (Arrangements)</option>
                        <option value="Misc">Miscellaneous (Accessories)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 px-3 tracking-widest">Standard Base Price (BHD)</label>
                      <input type="number" required className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-6 font-black text-lg focus:bg-white focus:border-brand-yellow outline-none transition-all" placeholder="0.00" value={newProduct.basePrice} onChange={e => setNewProduct({...newProduct, basePrice: parseFloat(e.target.value) || 0})} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 px-3 tracking-widest">Technical Description (EN)</label>
                    <textarea rows={3} className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-6 font-medium text-gray-600 focus:bg-white focus:border-brand-yellow outline-none transition-all resize-none" value={newProduct.descriptionEn} onChange={e => setNewProduct({...newProduct, descriptionEn: e.target.value})} />
                  </div>
                </div>
              </div>

              {renderDynamicSpecForm()}

              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-black text-white py-10 rounded-[3rem] font-black text-3xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:bg-brand-yellow hover:text-black hover:scale-[1.01] transition-all flex items-center justify-center gap-6 group"
              >
                {isUploading ? <RefreshCw className="animate-spin w-8 h-8" /> : <FileText className="w-8 h-8 group-hover:rotate-12 transition-transform" />}
                {locale === 'ar' ? 'نشر الأصل في الكتالوج' : 'Authorize & Commit Asset'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
