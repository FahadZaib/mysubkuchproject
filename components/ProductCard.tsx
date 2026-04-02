
import React from 'react';
import { Star, ShoppingBag, Heart, Plus, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (id: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick, isWishlisted, onToggleWishlist }) => {
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist?.(product.id);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative max-w-[280px] mx-auto w-full">
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onClick={() => onClick(product.id)}>
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {discount > 0 && (
            <div className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              -{discount}%
            </div>
          )}
          {product.isLatest && (
            <div className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase">
              New
            </div>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
           <button 
            onClick={handleWishlist}
            className={`p-2.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-[0ms] ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={() => onClick(product.id)}
            className="bg-white p-2.5 rounded-full shadow-lg text-gray-600 hover:text-emerald-600 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-[50ms]"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Cart Button (Floating) */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="absolute -bottom-10 group-hover:bottom-2 left-2 right-2 bg-emerald-600 text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-3.5 h-3.5" /> Add to Cart
        </button>
      </div>
      
      {/* Details */}
      <div className="p-3.5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-[10px] font-bold text-gray-700">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="font-bold text-gray-800 text-sm mb-2 leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => onClick(product.id)}>
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-sm font-extrabold text-gray-900">Rs. {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-[10px] text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
