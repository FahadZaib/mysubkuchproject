
import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, RefreshCcw, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { Product, AppRoute, User, Review } from '../types';
import { getProductRecommendation } from '../services/gemini';
import ProductCard from '../components/ProductCard';

interface ProductDetailProps {
  productId: string;
  onNavigate: (route: string) => void;
  onAddToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  user: User | null;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  productId, onNavigate, onAddToCart, wishlist, onToggleWishlist, products, onUpdateProduct, user 
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
  
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const found = products.find(p => p.id === productId);
    if (found) {
      setProduct(found);
      getProductRecommendation(found, products).then(setRecommendations);
      window.scrollTo(0, 0);
    }
  }, [productId, products]);

  if (!product) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNavigate(AppRoute.LOGIN);
      return;
    }
    
    const newReview: Review = {
      id: 'rev' + Date.now(),
      userName: user.name,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    const currentReviews = product.reviews || [];
    const updatedReviews = [newReview, ...currentReviews];
    const totalReviews = updatedReviews.length;
    
    const sumRating = updatedReviews.reduce((acc, rev) => acc + rev.rating, 0);
    const averageRating = parseFloat((sumRating / totalReviews).toFixed(1));

    const updatedProduct = {
      ...product,
      reviews: updatedReviews,
      reviewsCount: totalReviews,
      rating: averageRating
    };

    onUpdateProduct(updatedProduct);
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fadeIn">
      <button 
        onClick={() => onNavigate(AppRoute.SHOP)}
        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold mb-8 group transition-all"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-sm relative group">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-emerald-600 ring-4 ring-emerald-50' : 'border-gray-50'}`}
              >
                <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-6">
            <span className="bg-emerald-50 text-emerald-600 font-black uppercase tracking-[3px] text-[10px] px-3 py-1 rounded-full mb-4 inline-block">{product.category}</span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter leading-[1.1]">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-black">
                <Star className="w-4 h-4 fill-current" /> {product.rating}
              </div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{product.reviewsCount} Reviews</span>
            </div>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-black text-emerald-700">Rs. {product.price.toLocaleString()}</span>
            </div>

            <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 mb-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Marketplace Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                {(product.highlights || ['Verified Product', 'Best Value', 'Fast Delivery', 'High Rating']).map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[11px] font-black text-gray-600 uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 mb-10">
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xl shadow-emerald-900/10"
              >
                <ShoppingCart className="w-6 h-6" /> Add to Cart
              </button>
              <button 
                onClick={() => onToggleWishlist(product.id)}
                className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 border-2 transition-all ${wishlist.includes(product.id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-gray-500 hover:border-red-100 hover:text-red-500 hover:bg-red-50'}`}
              >
                <Heart className={`w-6 h-6 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                {wishlist.includes(product.id) ? 'Saved to Wishlist' : 'Save for Later'}
              </button>
            </div>

            <div className="space-y-4 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                <Truck className="w-5 h-5 text-emerald-600" /> 
                <div>
                  <p className="text-gray-900">Standard Delivery</p>
                  <p className="text-[10px] text-gray-400 font-medium">Free on orders above Rs. 5000</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> 
                <div>
                  <p className="text-gray-900">Buyer Protection</p>
                  <p className="text-[10px] text-gray-400 font-medium">100% Guaranteed Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">
        <div className="lg:col-span-12 space-y-10">
          <div className="border-b border-gray-100 flex gap-8">
            <button 
              onClick={() => setActiveTab('details')}
              className={`pb-4 border-b-2 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'details' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`pb-4 border-b-2 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'specs' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Specs
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 border-b-2 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'reviews' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Reviews ({product.reviewsCount})
            </button>
          </div>
          
          <div className="animate-fadeIn">
            {activeTab === 'details' && (
              <div className="prose prose-emerald max-w-none">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Product Overview</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Technical Specifications</h2>
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm max-w-3xl">
                  {product.specifications ? (
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-gray-100">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <tr key={key}>
                            <td className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] bg-gray-50/50 w-1/3">{key}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center text-gray-400 italic">No detailed specifications available.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                  <div className="flex-grow space-y-8">
                    <h2 className="text-2xl font-black text-gray-900">User Ratings</h2>
                    {(product.reviews && product.reviews.length > 0) ? (
                      <div className="space-y-4">
                        {product.reviews.map((rev) => (
                          <div key={rev.id} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                                  {rev.userName.charAt(0)}
                                </div>
                                <span className="font-bold text-gray-900">{rev.userName}</span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{rev.date}</span>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <p className="text-gray-600 text-sm">{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center bg-gray-50 rounded-[2.5rem] text-gray-400 italic">
                        Be the first to share your experience with this item.
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-96">
                    <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-900/20">
                      <h3 className="text-xl font-black mb-6">Write a Review</h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Rate It</label>
                          <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button 
                                key={s} 
                                type="button"
                                onClick={() => setNewRating(s)}
                                className={`transition-all ${s <= newRating ? 'text-yellow-400' : 'text-emerald-800'}`}
                              >
                                <Star className={`w-7 h-7 ${s <= newRating ? 'fill-current' : ''}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Your Thoughts</label>
                          <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                            placeholder="Type your message..."
                            className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 h-28 resize-none placeholder:text-emerald-800 text-white"
                          />
                        </div>
                        <button type="submit" className="w-full bg-white text-emerald-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 active:scale-[0.98] transition-all">
                          Submit Review <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <section className="pt-20 border-t border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tighter">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAddToCart={onAddToCart}
                onClick={(id) => onNavigate(`${AppRoute.PRODUCT.replace(':id', id)}`)}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
