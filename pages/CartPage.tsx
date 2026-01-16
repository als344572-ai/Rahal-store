
import React, { useState } from 'react';
import { Trash2, ShoppingBag, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, Lock, CreditCard as CardIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stripePromise } from '../stripe-client';

const CartPage: React.FC<{ t: any, locale: string, cart: any[], onRemove: (id: string) => void }> = ({ t, locale, cart, onRemove }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });

  const subtotal = cart.reduce((acc, curr) => acc + curr.total_price, 0);
  const vat = subtotal * 0.1;
  const total = subtotal + vat;

  const handleCheckout = async () => {
    if (!showStripeForm) {
      setShowStripeForm(true);
      return;
    }

    setIsProcessing(true);
    
    // Initialize Stripe
    const stripe = await stripePromise;
    
    if (!stripe) {
      alert("Stripe failed to initialize. Please check your internet connection.");
      setIsProcessing(false);
      return;
    }

    // In a real app, you would send card details to Stripe Elements 
    // and create a payment method. Here we simulate the final confirmation.
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
    }, 2500);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShieldCheck className="w-16 h-16 text-green-600" />
        </div>
        <h2 className="text-4xl font-black mb-6">{t.paymentSuccessful}</h2>
        <p className="text-gray-500 text-xl mb-12 leading-relaxed">
          {locale === 'ar' 
            ? 'تم تأكيد حجزك بنجاح عبر Stripe. سنقوم بالتواصل معك لتأكيد موعد التركيب قريباً.' 
            : 'Your booking has been confirmed successfully via Stripe. We will contact you to confirm installation timing soon.'}
        </p>
        <Link to="/" className="bg-brand-yellow text-black px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-yellow-400 transition-all shadow-xl shadow-brand-yellow/20 inline-block">
          {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 bg-brand-yellow/10 rounded-[1.5rem] flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-black" />
        </div>
        <div>
          <h1 className="text-5xl font-black">{t.cart}</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">{cart.length} {locale === 'ar' ? 'منتجات' : 'Items'}</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100 shadow-sm animate-in fade-in duration-700">
          <p className="text-gray-400 text-2xl font-medium mb-10">{locale === 'ar' ? 'سلة المشتريات فارغة' : 'Your cart is currently empty'}</p>
          <Link to="/shop" className="bg-black text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:scale-105 transition-all inline-block shadow-2xl">
            {locale === 'ar' ? 'ابدأ التسوق' : 'Start Shopping'}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-8">
            {!showStripeForm ? (
              cart.map((item) => (
                <div key={item.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-10 hover:shadow-xl transition-all duration-500">
                  <div className="w-full sm:w-48 h-48 bg-gray-50 rounded-[2rem] overflow-hidden p-4 flex items-center justify-center">
                    <img src={item.product_image} className="max-w-full max-h-full object-contain" alt="Product" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black leading-tight">{locale === 'ar' ? item.product_name_ar : item.product_name_en}</h3>
                      <button onClick={() => onRemove(item.id)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm mb-6">
                      <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span><span className="text-gray-400 font-bold uppercase tracking-tighter">{t.selectSize}:</span> <span className="font-black">{item.size_name}</span></div>
                      <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span><span className="text-gray-400 font-bold uppercase tracking-tighter">{t.selectColor}:</span> <span className="font-black">{item.color}</span></div>
                      <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span><span className="text-gray-400 font-bold uppercase tracking-tighter">{t.startDate}:</span> <span className="font-black">{item.start_date}</span></div>
                      <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span><span className="text-gray-400 font-bold uppercase tracking-tighter">{t.endDate}:</span> <span className="font-black">{item.end_date}</span></div>
                    </div>
                    <div className="text-3xl font-black text-black">{item.total_price.toFixed(2)} <span className="text-sm text-gray-300">{t.currency}</span></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl animate-in slide-in-from-bottom-8">
                <div className="flex items-center justify-between mb-10">
                   <h2 className="text-3xl font-black">{locale === 'ar' ? 'تفاصيل الدفع (Stripe)' : 'Payment Details (Stripe)'}</h2>
                   <div className="flex gap-2">
                     <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase">Visa</div>
                     <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase">MC</div>
                   </div>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{locale === 'ar' ? 'رقم البطاقة' : 'Card Number'}</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-yellow focus:bg-white rounded-2xl px-6 py-5 font-bold text-lg outline-none transition-all pl-14"
                        value={cardData.number}
                        onChange={e => setCardData({...cardData, number: e.target.value})}
                      />
                      <CardIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{locale === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                      <input 
                        type="text" 
                        placeholder="MM / YY"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-yellow focus:bg-white rounded-2xl px-6 py-5 font-bold text-lg outline-none transition-all"
                        value={cardData.expiry}
                        onChange={e => setCardData({...cardData, expiry: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">CVC</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="•••"
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-yellow focus:bg-white rounded-2xl px-6 py-5 font-bold text-lg outline-none transition-all pl-14"
                          value={cardData.cvc}
                          onChange={e => setCardData({...cardData, cvc: e.target.value})}
                        />
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                      {locale === 'ar' 
                        ? 'سيتم معالجة بياناتك بأمان عبر Stripe. رحال للخيام لا تقوم بتخزين بيانات بطاقتك الائتمانية.' 
                        : 'Your data is processed securely via Stripe. Rahal Tent does not store your credit card information.'}
                    </p>
                  </div>

                  <button 
                    onClick={() => setShowStripeForm(false)}
                    className="text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-black transition-colors"
                  >
                    {locale === 'ar' ? 'العودة لمراجعة السلة' : 'Go back to review cart'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[26rem]">
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl sticky top-28">
              <h3 className="text-3xl font-black mb-10">{locale === 'ar' ? 'ملخص الحجز' : 'Booking Summary'}</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-xs">
                  <span>{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="text-black">{subtotal.toFixed(2)} {t.currency}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-xs">
                  <span>{locale === 'ar' ? 'ضريبة (10%)' : 'VAT (10%)'}</span>
                  <span className="text-black">{vat.toFixed(2)} {t.currency}</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black">{locale === 'ar' ? 'الإجمالي' : 'Total Amount'}</span>
                  <span className="text-4xl font-black text-black">{total.toFixed(2)} <span className="text-base text-gray-300 font-bold">{t.currency}</span></span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-[2rem] flex gap-4 items-start text-sm text-gray-500 leading-relaxed border border-gray-100">
                  <ShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <p>{locale === 'ar' ? 'عملية دفع آمنة عبر Stripe. نضمن لك خصوصية بياناتك.' : 'Fully secure payment via Stripe. We guarantee your data privacy.'}</p>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-brand-yellow text-black py-6 rounded-[2rem] font-black text-xl hover:bg-yellow-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-2xl shadow-brand-yellow/30 flex items-center justify-center gap-4 group"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-3">
                      <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                      {locale === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                    </span>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
                      {showStripeForm ? (locale === 'ar' ? 'تأكيد الدفع' : 'Pay with Stripe') : t.confirmPayment}
                    </>
                  )}
                </button>
              </div>

              <Link to="/shop" className="mt-8 flex items-center justify-center gap-3 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-black transition-colors">
                {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {locale === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}
                {locale === 'ar' ? <ArrowLeft className="w-4 h-4 invisible" /> : <ArrowRight className="w-4 h-4 invisible" />}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
