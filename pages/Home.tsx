
import React, { useState, useEffect } from 'react';
import { ArrowRight, Truck, ShieldCheck, MessageCircle, Clock, Tag, Zap, Percent, ShoppingBag, Instagram, Eye } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Product, AppRoute, Banner, CarouselSlide, TeamMember, GalleryImage, Offer, SiteSettings } from '../types';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  onNavigate: (route: string) => void;
  onAddToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  products: Product[];
  carouselSlides: CarouselSlide[];
  onSubscribe: (email: string) => boolean;
  siteSettings: SiteSettings;
  galleryImages?: GalleryImage[];
}

const Home: React.FC<HomeProps> = ({ 
  onNavigate, onAddToCart, wishlist, onToggleWishlist, products,
  carouselSlides = [], onSubscribe, siteSettings, galleryImages = []
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const weeklyOffers: Offer[] = [
    { id: 'off1', title: 'Kitchen Essentials', discount: 'Flat 40% OFF', code: 'KITCHEN40', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600' },
    { id: 'off2', title: 'Fashion Accessories', discount: 'Up to 60% OFF', code: 'GLAM60', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600' },
    { id: 'off3', title: 'Toys & Fun', discount: 'Buy 1 Get 1 Free', code: 'KIDDO', image: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?auto=format&fit=crop&w=600' }
  ];

  useEffect(() => {
    if (carouselSlides.length > 1) {
      const timer = setInterval(() => { setCurrentSlide((prev) => (prev + 1) % carouselSlides.length); }, 5000);
      return () => clearInterval(timer);
    }
  }, [carouselSlides.length]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubscribe(subEmail)) {
      setSubStatus('success');
      setSubEmail('');
    } else {
      setSubStatus('error');
    }
  };

  const latestArrivals = products.filter(p => p.isNewArrival || p.isLatest).slice(0, 4);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Hero Carousel */}
      <section className="relative h-[450px] md:h-[650px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          {carouselSlides.length > 0 ? carouselSlides.map((slide, index) => (
            <div key={slide.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col justify-center items-start text-white max-w-4xl">
                <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[3px] px-3 py-1.5 rounded-full mb-4 inline-block">{slide.tagline}</span>
                <h1 className="text-3xl md:text-6xl font-black mb-4 leading-tight tracking-tighter">{slide.title}</h1>
                <p className="text-base md:text-lg text-gray-200 mb-6 max-w-xl leading-relaxed font-medium opacity-90">{slide.subtitle}</p>
                <button onClick={() => onNavigate(slide.route)} className="px-8 py-3.5 bg-white text-emerald-900 hover:bg-emerald-500 hover:text-white font-black rounded-xl transition-all flex items-center gap-2 group shadow-xl">
                  {slide.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )) : (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <p className="text-white font-black text-xl">Loading Experience...</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl grid grid-cols-2 lg:grid-cols-4 p-8 border border-gray-50 gap-6">
          {[
            { icon: Truck, title: "Free Delivery", text: "Over Rs. 10,000" },
            { icon: ShieldCheck, title: "Secure Payment", text: "100% Protected" },
            { icon: Zap, title: "Flash Deals", text: "Updates Daily" },
            { 
              icon: MessageCircle, 
              title: "Expert Support", 
              text: "Chat via WhatsApp", 
              onClick: () => window.open('https://wa.me/03022634841', '_blank')
            }
          ].map((item, i) => (
            <div key={i} onClick={item.onClick} className={`flex items-center gap-4 border-r last:border-0 border-gray-100 pr-4 ${item.onClick ? 'cursor-pointer hover:bg-emerald-50 transition-colors p-2 rounded-xl' : ''}`}>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs">{item.title}</h4>
                <p className="text-[10px] text-gray-400">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sale & Offers Section */}
      {siteSettings.showMegaSale && (
        <section className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[4px] block mb-2">Exclusive Deals</span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">Mega Sale & Weekly Offers</h2>
              </div>
              <div className="hidden md:flex items-center gap-3 bg-orange-50 text-orange-600 px-5 py-2.5 rounded-2xl border border-orange-100">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest">Ending in: 08:42:15</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {weeklyOffers.map((offer) => (
                <div 
                  key={offer.id} 
                  className="group relative h-80 rounded-[2.5rem] overflow-hidden bg-gray-900 shadow-lg cursor-pointer transition-all hover:-translate-y-1"
                  onClick={() => onNavigate(AppRoute.SHOP)}
                >
                  <img src={offer.image} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" alt={offer.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-8 flex flex-col justify-end">
                    <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full self-start mb-3 uppercase tracking-widest shadow-lg">
                      {offer.discount}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight">{offer.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
                        <Tag className="w-3.5 h-3.5" /> Code: {offer.code}
                      </div>
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white group-hover:bg-emerald-500 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hero Flash Sale Banner */}
      {siteSettings.showFlashSale && (
        <section className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group">
            <div className="absolute top-0 right-0 p-20 -mr-20 -mt-20 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 p-20 -ml-20 -mb-20 bg-orange-400/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-black/20 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                <Percent className="w-4 h-4" /> Grand Launching Offer
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
                Get Extra 20% Off <br/>On Your First Order
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={() => onNavigate(AppRoute.SHOP)}
                  className="bg-white text-orange-600 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-3"
                >
                  Claim Offer Now <ShoppingBag className="w-4 h-4" />
                </button>
                <p className="text-white/80 text-xs font-bold italic">*Applicable on all items above Rs. 2000</p>
              </div>
            </div>
            
            <div className="relative z-10 hidden lg:block transform group-hover:rotate-6 transition-transform duration-500">
               <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl">
                  <div className="text-white font-black text-8xl opacity-10 absolute -top-10 -right-4">SUBKUCH</div>
                  <h4 className="text-white font-black text-xl mb-4 text-center">Your Coupon Code</h4>
                  <div className="bg-white px-8 py-4 rounded-2xl text-orange-600 font-black text-3xl tracking-[8px] text-center shadow-inner border-2 border-orange-100">
                    WELCOME20
                  </div>
                  <p className="text-white/60 text-[10px] font-bold text-center mt-4 uppercase tracking-[4px]">Verified Merchant</p>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">New Arrivals</h2>
            <p className="text-sm text-gray-500">Freshly added items at SubKuch.pk</p>
          </div>
          <button onClick={() => onNavigate(AppRoute.SHOP)} className="text-emerald-600 font-bold text-sm flex items-center gap-2 group">
            See All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {latestArrivals.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onClick={(id) => onNavigate(`${AppRoute.PRODUCT.replace(':id', id)}`)} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
          ))}
        </div>
      </section>

      {/* Lookbook Gallery */}
      {galleryImages.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[4px] block mb-2">Social Hub</span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">SubKuch Style Lookbook</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <div key={img.id} className={`group relative overflow-hidden rounded-[2rem] bg-gray-100 ${idx === 0 || idx === 3 ? 'md:row-span-2 md:h-auto h-64' : 'h-64'}`}>
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center">
                   <Instagram className="w-8 h-8 mb-3" />
                   <p className="text-xs font-bold leading-relaxed">{img.caption}</p>
                   <button className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white text-gray-900 px-4 py-2 rounded-xl">
                     <Eye className="w-3.5 h-3.5" /> View Details
                   </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-emerald-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">Join SubKuch Plus</h2>
            <p className="text-emerald-50 mb-8 max-w-md mx-auto">Get exclusive weekly updates on flash sales.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto bg-white/10 p-2 rounded-2xl backdrop-blur-md">
              <input 
                type="email" 
                required 
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="Email address" 
                className="bg-white px-6 py-4 rounded-xl flex-grow text-gray-900 font-bold focus:outline-none" 
              />
              <button type="submit" className="bg-gray-900 text-white font-black px-8 py-4 rounded-xl hover:bg-emerald-950 transition-all">Join Now</button>
            </form>
            {subStatus === 'success' && <p className="mt-4 text-emerald-100 font-bold animate-fadeIn">Thanks for subscribing!</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
