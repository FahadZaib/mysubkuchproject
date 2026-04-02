
import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User as UserIcon, Heart, Menu, X, LayoutDashboard, ChevronDown, MapPin, Bell } from 'lucide-react';
import { AppRoute, User, Category, Order } from '../types';

interface HeaderProps {
  cartCount: number;
  onNavigate: (route: string) => void;
  onOpenCart: () => void;
  onSearch: (query: string) => void;
  user: User | null;
  categories: Category[];
  orders?: Order[];
}

const Header: React.FC<HeaderProps> = ({ cartCount, onNavigate, onOpenCart, onSearch, user, categories, orders = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const newOrdersCount = orders.filter(o => o.isNew).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Banner */}
      <div className="bg-emerald-600 text-white text-[10px] md:text-xs py-2 px-4 text-center font-bold flex justify-center items-center gap-4">
        <span>🇵🇰 Delivering Joy Across Pakistan - Everything in One Place!</span>
        {user?.role === 'admin' && (
          <button 
            onClick={() => onNavigate(AppRoute.DASHBOARD)}
            className="hidden lg:flex items-center gap-1.5 bg-white/20 px-3 py-0.5 rounded-full text-[9px] hover:bg-white/30 transition-all uppercase tracking-widest font-black relative"
          >
            <LayoutDashboard className="w-3 h-3" /> Dashboard
            {newOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[7px] items-center justify-center font-black">
                  {newOrdersCount}
                </span>
              </span>
            )}
          </button>
        )}
      </div>

      {/* Main Bar */}
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-6">
        {/* Logo */}
        <div 
          onClick={() => onNavigate(AppRoute.HOME)}
          className="flex-shrink-0 cursor-pointer group"
        >
          <h1 className="text-xl md:text-2xl font-black text-emerald-700 tracking-tighter transition-transform group-hover:scale-105">
            SubKuch<span className="text-orange-500">.pk</span>
          </h1>
        </div>

        {/* Centered Search Bar */}
        <div className="hidden md:flex flex-grow max-w-xl justify-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full group">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Find anything: kurtas, juicers, toys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-3 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-sm font-medium"
              />
              <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                <Search className="w-4.5 h-4.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <button 
                type="submit" 
                className="absolute right-1.5 bg-emerald-600 text-white px-6 py-1.5 rounded-full text-xs font-black hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <button 
            onClick={() => onNavigate(user ? AppRoute.ACCOUNT : AppRoute.LOGIN)}
            className="hidden sm:flex flex-col items-center text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <UserIcon className="w-5.5 h-5.5" />
            <span className="text-[9px] font-black uppercase mt-1 tracking-wider">
              {user ? user.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>
          
          <button 
            onClick={() => onNavigate(AppRoute.TRACKING)}
            className="hidden sm:flex flex-col items-center text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <MapPin className="w-5.5 h-5.5" />
            <span className="text-[9px] font-black uppercase mt-1 tracking-wider">Track</span>
          </button>

          <button 
            onClick={onOpenCart}
            className="relative flex flex-col items-center text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:block text-[9px] font-black uppercase mt-1 tracking-wider">Cart</span>
          </button>
          
          <button 
            className="md:hidden text-gray-600 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            {!isMenuOpen && newOrdersCount > 0 && user?.role === 'admin' && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Row - Pages */}
      <nav className="hidden md:block border-t border-gray-50 bg-white">
        <div className="container mx-auto px-4 flex items-center justify-center gap-10 py-3.5">
          <button 
            onClick={() => onNavigate(AppRoute.HOME)}
            className="text-[11px] font-black text-gray-900 hover:text-emerald-600 uppercase tracking-widest transition-all"
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate(AppRoute.SHOP)}
            className="text-[11px] font-black text-gray-900 hover:text-emerald-600 uppercase tracking-widest transition-all"
          >
            All Products
          </button>
          
          {/* Category Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="flex items-center gap-1.5 text-[11px] font-black text-gray-900 hover:text-emerald-600 uppercase tracking-widest transition-all"
            >
              Categories <ChevronDown className={`w-3 h-3 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
            </button>
            {isCatOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 grid grid-cols-1 gap-1 animate-fadeIn">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { onNavigate(`${AppRoute.SHOP}?category=${cat.id}`); setIsCatOpen(false); }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 text-left transition-all group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="text-[11px] font-bold text-gray-600 group-hover:text-emerald-700">{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => onNavigate(AppRoute.TRACKING)}
            className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-all"
          >
            Track Order
          </button>
          <button 
            onClick={() => onNavigate(AppRoute.ABOUT)}
            className="text-[11px] font-black text-gray-900 hover:text-emerald-600 uppercase tracking-widest transition-all"
          >
            About
          </button>
          <button 
            onClick={() => onNavigate(AppRoute.CONTACT)}
            className="text-[11px] font-black text-gray-900 hover:text-emerald-600 uppercase tracking-widest transition-all"
          >
            Contact Us
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 p-6 shadow-2xl animate-fadeIn h-[calc(100vh-64px)] overflow-y-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-8">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </form>
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <button onClick={() => { onNavigate(AppRoute.HOME); setIsMenuOpen(false); }} className="text-sm font-black text-gray-900 text-left uppercase tracking-widest">Home</button>
              <button onClick={() => { onNavigate(AppRoute.SHOP); setIsMenuOpen(false); }} className="text-sm font-black text-gray-900 text-left uppercase tracking-widest">All Products</button>
              <button onClick={() => { onNavigate(AppRoute.TRACKING); setIsMenuOpen(false); }} className="text-sm font-black text-emerald-600 text-left uppercase tracking-widest">Track Order</button>
              <button onClick={() => { onNavigate(AppRoute.ABOUT); setIsMenuOpen(false); }} className="text-sm font-black text-gray-900 text-left uppercase tracking-widest">About</button>
              <button onClick={() => { onNavigate(AppRoute.CONTACT); setIsMenuOpen(false); }} className="text-sm font-black text-gray-900 text-left uppercase tracking-widest">Contact Us</button>
              {user?.role === 'admin' && (
                 <button onClick={() => { onNavigate(AppRoute.DASHBOARD); setIsMenuOpen(false); }} className="text-sm font-black text-red-600 text-left uppercase tracking-widest flex items-center justify-between">
                   Admin Dashboard {newOrdersCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{newOrdersCount} New</span>}
                 </button>
              )}
            </div>
            
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2 pt-4">Market Categories</h3>
            <div className="grid grid-cols-2 gap-3 pb-8">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => { onNavigate(`${AppRoute.SHOP}?category=${cat.id}`); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 text-left hover:bg-emerald-50 transition-all"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[10px] font-bold text-gray-600">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
