
import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Product, AppRoute, Category } from '../types';
import ProductCard from '../components/ProductCard';

interface ShopProps {
  initialCategory?: string;
  onNavigate: (route: string) => void;
  onAddToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  searchResults: Product[] | null;
  isSearching: boolean;
  clearSearch: () => void;
  products: Product[];
  categories: Category[];
}

const Shop: React.FC<ShopProps> = ({ 
  initialCategory, onNavigate, onAddToCart, wishlist, onToggleWishlist, 
  searchResults, isSearching, clearSearch, products, categories 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceLimit, setPriceLimit] = useState(100000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    let result = searchResults ? [...searchResults] : [...products];
    
    // Category Filter
    if (selectedCategory !== 'all' && !searchResults) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price Filter
    result = result.filter(p => p.price <= priceLimit);
    
    // Sort logic
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    // Fixed: replaced undefined 'p' with 'a'
    else result.sort((a, b) => (a.isLatest ? -1 : 1)); // Mock "newest" using latest flag
    
    return result;
  }, [selectedCategory, sortBy, priceLimit, searchResults, products]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block w-64 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm uppercase tracking-widest">Browse</h3>
              <button onClick={() => { clearSearch(); setSelectedCategory('all'); setPriceLimit(100000); }} className="text-[10px] text-emerald-600 font-black hover:underline">Clear All</button>
            </div>
            <div className="space-y-1.5">
              <button onClick={() => setSelectedCategory('all')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black ${selectedCategory === 'all' ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}>All Products</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 ${selectedCategory === cat.id ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}>
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-black text-gray-900 mb-6 text-sm uppercase tracking-widest">Price Limit: Rs. {priceLimit.toLocaleString()}</h3>
            <input 
              type="range" 
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
              min="0" 
              max="100000" 
              step="500"
              value={priceLimit}
              onChange={(e) => setPriceLimit(Number(e.target.value))}
            />
          </div>
        </aside>

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <h1 className="text-2xl font-black text-gray-900">
              {selectedCategory === 'all' ? 'Marketplace' : categories.find(c => c.id === selectedCategory)?.name}
            </h1>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs font-black border border-gray-100 bg-white rounded-xl px-4 py-2.5 outline-none">
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onClick={(id) => onNavigate(`${AppRoute.PRODUCT.replace(':id', id)}`)} isWishlisted={wishlist.includes(product.id)} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
