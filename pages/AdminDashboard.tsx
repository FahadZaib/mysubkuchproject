
import React, { useState, useRef, useMemo } from 'react';
import { LayoutDashboard, Package, Users, ShoppingBag, TrendingUp, DollarSign, Edit3, Trash2, Plus, X, List, Image as ImageIcon, ShieldAlert, ShieldCheck, UserPlus, Ban, Unlock, Layers, FileUp, UserMinus, Clock, MapPin, Phone, Mail, ShoppingCart, User as UserIcon, Bell, Megaphone, FileText, Search, AlertCircle, ArrowRight, Layout, UserCog, Shield, Tags, Eye, EyeOff, Grid } from 'lucide-react';
import { Product, Banner, CarouselSlide, TeamMember, GalleryImage, Offer, User, Category, Order, ContactQuery, AppRoute, SiteSettings } from '../types';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  currentUser: User;
  banner: Banner;
  onUpdateBanner: (banner: Banner) => void;
  carouselSlides: CarouselSlide[];
  onUpdateSlides: (slides: CarouselSlide[]) => void;
  teamMembers: TeamMember[];
  onUpdateTeam: (team: TeamMember[]) => void;
  galleryImages: GalleryImage[];
  onUpdateGallery: (gallery: GalleryImage[]) => void;
  subscribers: string[];
  contactQueries: ContactQuery[];
  aboutContent: any;
  onUpdateAbout: (content: any) => void;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const { 
    products, onUpdateProducts, categories, onUpdateCategories, 
    users, onUpdateUsers, orders, onUpdateOrders, currentUser, 
    banner, onUpdateBanner, carouselSlides, onUpdateSlides,
    teamMembers, onUpdateTeam, galleryImages, onUpdateGallery, 
    subscribers, contactQueries, aboutContent, onUpdateAbout,
    siteSettings, onUpdateSiteSettings
  } = props;

  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'categories' | 'orders' | 'users' | 'inquiries' | 'site' | 'gallery'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryImage | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  
  const isRootAdmin = currentUser.email === 'adminfahad125@subkuch.pk';

  const newOrdersCount = orders.filter(o => o.isNew).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const stats = [
    { name: 'Revenue', value: `Rs. ${(orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total, 0)).toLocaleString()}`, icon: DollarSign, color: 'emerald' },
    { name: 'Active Items', value: products.length, icon: Package, color: 'blue' },
    { name: 'Accounts', value: users.length, icon: Users, color: 'orange' },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: ShieldCheck, color: 'purple' },
    { name: 'Canceled', value: orders.filter(o => o.status === 'cancelled').length, icon: Ban, color: 'red' },
    { name: 'New Orders', value: newOrdersCount, icon: Bell, color: 'red', pulse: newOrdersCount > 0 },
  ];

  const handleUpdateStatus = (id: string, status: Order['status']) => {
    onUpdateOrders(orders.map(o => o.id === id ? { ...o, status, isNew: false } : o));
  };

  const filteredItems = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  // Category Management Handlers
  const handleSaveCategory = (category: Category) => {
    const exists = categories.find(c => c.id === category.id);
    if (exists) {
      onUpdateCategories(categories.map(c => c.id === category.id ? category : c));
    } else {
      onUpdateCategories([...categories, category]);
    }
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (products.some(p => p.category === id)) {
      alert("Cannot delete this category because it contains products. Move the products first.");
      return;
    }
    if (confirm("Are you sure you want to delete this category?")) {
      onUpdateCategories(categories.filter(c => c.id !== id));
    }
  };

  // User Management Handlers
  const handleToggleBlockUser = (userId: string) => {
    const userToEdit = users.find(u => u.id === userId);
    if (!userToEdit) return;
    if (userToEdit.email === 'adminfahad125@subkuch.pk') {
      alert("Root Administrator cannot be deactivated.");
      return;
    }
    if (userId === currentUser.id) {
      alert("You cannot deactivate your own account.");
      return;
    }
    onUpdateUsers(users.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  const handleToggleAdminRole = (userId: string) => {
    const userToEdit = users.find(u => u.id === userId);
    if (!userToEdit) return;
    if (userToEdit.email === 'adminfahad125@subkuch.pk') {
      alert("Root Administrator role cannot be changed.");
      return;
    }
    if (userId === currentUser.id) {
      alert("You cannot change your own role.");
      return;
    }
    onUpdateUsers(users.map(u => u.id === userId ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u));
  };

  const handleDeleteUser = (userId: string) => {
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit?.email === 'adminfahad125@subkuch.pk') {
      alert("Root Administrator cannot be removed.");
      return;
    }
    if (userId === currentUser.id) {
      alert("You cannot delete your own account while logged in.");
      return;
    }
    if (confirm(`Are you sure you want to permanently delete ${userToEdit?.name}'s account? This action cannot be undone.`)) {
      onUpdateUsers(users.filter(u => u.id !== userId));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.phone && u.phone.includes(userSearch))
  );

  // Carousel Handlers
  const handleSaveSlide = (slide: CarouselSlide) => {
    const exists = carouselSlides.find(s => s.id === slide.id);
    if (exists) {
      onUpdateSlides(carouselSlides.map(s => s.id === slide.id ? slide : s));
    } else {
      onUpdateSlides([...carouselSlides, slide]);
    }
    setEditingSlide(null);
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm("Delete this hero slide?")) {
      onUpdateSlides(carouselSlides.filter(s => s.id !== id));
    }
  };

  // Team Handlers
  const handleSaveTeamMember = (member: TeamMember) => {
    onUpdateTeam(teamMembers.map(m => m.id === member.id ? member : m));
    setEditingTeam(null);
  };

  // Gallery Handlers
  const handleSaveGalleryItem = (item: GalleryImage) => {
    const exists = galleryImages.find(g => g.id === item.id);
    if (exists) {
      onUpdateGallery(galleryImages.map(g => g.id === item.id ? item : g));
    } else {
      onUpdateGallery([...galleryImages, item]);
    }
    setEditingGallery(null);
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (confirm("Delete this gallery look?")) {
      onUpdateGallery(galleryImages.filter(g => g.id !== id));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">SubKuch Admin Hub</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Logged in as {currentUser.name}</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Main' },
              { id: 'inventory', label: 'Items' },
              { id: 'categories', label: 'Categories' },
              { id: 'orders', label: 'Orders', badge: pendingOrdersCount },
              { id: 'users', label: 'Accounts' },
              { id: 'gallery', label: 'Lookbook' },
              { id: 'site', label: 'CMS' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-6 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 relative ${activeTab === tab.id ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-gray-900'}`}
              >
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black ${activeTab === tab.id ? 'bg-white text-emerald-600' : 'bg-red-50 text-white'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {pendingOrdersCount > 0 && (
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                    <AlertCircle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-orange-900">Pending Actions Required</h3>
                    <p className="text-orange-700/70 text-sm font-medium">You have {pendingOrdersCount} orders waiting for processing.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="bg-orange-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all"
                >
                  Process Now
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className={`bg-white p-8 rounded-[2rem] border shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-all ${stat.pulse ? 'ring-2 ring-red-500/20' : ''}`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600 mb-4 transition-transform group-hover:scale-110`} />
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{stat.name}</p>
                  <h3 className="text-3xl font-black">{stat.value}</h3>
                  {stat.pulse && <span className="absolute top-4 right-4 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-white p-6 rounded-3xl flex justify-between items-center gap-4">
               <div className="relative flex-grow max-w-md">
                 <input type="text" placeholder="Search product..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl" />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
               </div>
               <button onClick={() => setEditingProduct({ id: 'p'+Date.now(), name: '', description: '', price: 0, category: categories[0]?.id || 'uncategorized', images: ['https://picsum.photos/600/600'], rating: 5, reviewsCount: 0, stock: 10, highlights: [] })} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-xs">+ Add Product</button>
             </div>
             
             <div className="bg-white rounded-3xl overflow-hidden border shadow-sm">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 font-black text-[10px] text-gray-400 uppercase">
                    <tr><th className="p-6">Details</th><th>Category</th><th>Stock</th><th>Arrival</th><th>Action</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredItems.map(p => (
                      <tr key={p.id}>
                        <td className="p-6 flex items-center gap-3">
                          <img src={p.images[0]} className="w-10 h-10 rounded-lg" />
                          <div><p className="font-bold text-sm">{p.name}</p><p className="text-xs text-gray-400">Rs. {p.price.toLocaleString()}</p></div>
                        </td>
                        <td className="p-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                          {categories.find(c => c.id === p.category)?.name || 'Unknown'}
                        </td>
                        <td className="p-6"><span className={`font-black ${p.stock <= 0 ? 'text-red-500' : 'text-gray-700'}`}>{p.stock}</span></td>
                        <td className="p-6"><button onClick={() => onUpdateProducts(products.map(x => x.id === p.id ? { ...x, isNewArrival: !x.isNewArrival } : x))} className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${p.isNewArrival ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>{p.isNewArrival ? 'New' : 'Standard'}</button></td>
                        <td className="p-6 flex gap-2">
                           <button onClick={() => setEditingProduct(p)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit3 className="w-4 h-4"/></button>
                           <button onClick={() => onUpdateProducts(products.filter(x => x.id !== p.id))} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl flex justify-between items-center border shadow-sm">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2"><Tags className="w-5 h-5 text-emerald-600" /> Marketplace Categories</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Manage product classifications</p>
              </div>
              <button 
                onClick={() => setEditingCategory({ id: 'cat_' + Date.now(), name: '', image: 'https://picsum.photos/400/400', icon: '📦' })} 
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
              >
                + Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    <img src={cat.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{cat.icon}</span>
                      <h4 className="font-black text-gray-900">{cat.name}</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {products.filter(p => p.category === cat.id).length} Products
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setEditingCategory(cat)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><Edit3 className="w-4 h-4"/></button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl flex justify-between items-center border shadow-sm">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2"><Grid className="w-5 h-5 text-emerald-600" /> Style Lookbook CMS</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Manage home gallery images</p>
              </div>
              <button 
                onClick={() => setEditingGallery({ id: 'g' + Date.now(), url: 'https://picsum.photos/seed/gallery/600/600', caption: '' })} 
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
              >
                + Add to Gallery
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages.map(img => (
                <div key={img.id} className="bg-white rounded-3xl overflow-hidden border shadow-sm group">
                  <div className="aspect-square bg-gray-50 relative">
                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button onClick={() => setEditingGallery(img)} className="p-2 bg-white/90 backdrop-blur-md text-emerald-600 rounded-lg shadow-sm hover:bg-emerald-600 hover:text-white transition-all"><Edit3 className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteGalleryItem(img.id)} className="p-2 bg-white/90 backdrop-blur-md text-red-600 rounded-lg shadow-sm hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Caption</p>
                    <p className="text-xs font-bold text-gray-900 line-clamp-2">{img.caption || 'No caption'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 border shadow-sm">
              <div className="relative flex-grow max-w-md w-full">
                 <input 
                  type="text" 
                  placeholder="Find user by name, email or phone..." 
                  value={userSearch} 
                  onChange={e => setUserSearch(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500/10 font-medium" 
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Accounts</p>
                  <p className="text-xl font-black text-emerald-600">{users.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50 font-black text-[10px] text-gray-400 uppercase tracking-[2px]">
                    <tr>
                      <th className="p-6">User Profile</th>
                      <th>Account Status</th>
                      <th>Permissions</th>
                      <th>Action Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className={`${u.isBlocked ? 'bg-red-50/20' : ''} transition-colors group`}>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                              {u.avatar ? (
                                <img src={u.avatar} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-black text-gray-300 uppercase">{u.name.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-gray-900 flex items-center gap-1.5">
                                {u.name}
                                {u.role === 'admin' && <Shield className="w-3.5 h-3.5 text-purple-600" />}
                              </p>
                              <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                              {u.phone && <p className="text-[10px] text-emerald-600 font-black mt-0.5">{u.phone}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          {u.isBlocked ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200">
                              <Ban className="w-3 h-3" /> Deactivated
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                              <Unlock className="w-3 h-3" /> Active Account
                            </span>
                          )}
                        </td>
                        <td className="p-6">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            u.role === 'admin' 
                            ? 'bg-purple-100 text-purple-600 border-purple-200' 
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleToggleBlockUser(u.id)}
                              disabled={u.email === 'adminfahad125@subkuch.pk' || u.id === currentUser.id}
                              className={`p-2.5 rounded-xl border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                                u.isBlocked 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                              }`}
                              title={u.isBlocked ? "Activate Account" : "Deactivate Account"}
                            >
                              {u.isBlocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => handleToggleAdminRole(u.id)}
                              disabled={u.email === 'adminfahad125@subkuch.pk' || u.id === currentUser.id}
                              className={`p-2.5 rounded-xl border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                                u.role === 'admin' 
                                ? 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100' 
                                : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100'
                              }`}
                              title={u.role === 'admin' ? "Remove Admin Privileges" : "Promote to Admin"}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.email === 'adminfahad125@subkuch.pk' || u.id === currentUser.id}
                              className="p-2.5 bg-white text-gray-300 hover:bg-red-50 hover:text-red-600 border border-gray-100 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Permanently Remove Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
             <div className="flex bg-white p-2 rounded-2xl border shadow-sm gap-2">
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs flex items-center gap-2">
                  Active Orders 
                  {pendingOrdersCount > 0 && <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{pendingOrdersCount}</span>}
                </button>
                <button className="px-6 py-3 bg-gray-50 text-gray-400 rounded-xl font-black text-xs">History</button>
             </div>
             <div className="bg-white rounded-3xl overflow-hidden border shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 font-black text-[10px] uppercase text-gray-400">
                    <tr><th className="p-6">Order ID</th><th>Customer</th><th>Status</th><th>Total</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className={`${o.isNew ? 'bg-emerald-50/30' : ''} transition-colors group`}>
                        <td className="p-6 font-black flex items-center gap-3">
                          {o.id}
                          {o.isNew && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                          )}
                        </td>
                        <td className="p-6 font-bold">{o.customerName}<br/><span className="text-xs text-gray-400">{o.customerPhone}</span></td>
                        <td className="p-6">
                           <select 
                             value={o.status} 
                             onChange={e => handleUpdateStatus(o.id, e.target.value as any)} 
                             className={`p-2 border rounded-lg text-[10px] font-black uppercase tracking-widest outline-none transition-all ${
                               o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                               o.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                               o.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-600'
                             }`}
                           >
                              <option value="pending">Pending</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="shipped">Handed to Partner</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                           </select>
                        </td>
                        <td className="p-6 font-black text-emerald-700 text-sm">Rs. {o.total.toLocaleString()}</td>
                        <td className="p-6"><button className="text-gray-400 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition-colors">Details</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'site' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
             <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6 h-fit">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-black flex items-center gap-2"><Layout className="w-5 h-5 text-emerald-600" /> Hero Slider CMS</h3>
                  <button 
                    onClick={() => setEditingSlide({ id: 's'+Date.now(), tagline: '', title: '', subtitle: '', image: 'https://picsum.photos/seed/slide/1920/1080', cta: 'Shop Now', route: AppRoute.SHOP })}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    + Add Slide
                  </button>
                </div>
                
                <div className="space-y-4">
                   {carouselSlides.map(slide => (
                     <div key={slide.id} className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 group">
                        <img src={slide.image} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                        <div className="flex-grow">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{slide.tagline}</p>
                          <h4 className="font-bold text-sm line-clamp-1">{slide.title}</h4>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => setEditingSlide(slide)} className="p-2 bg-white text-gray-400 hover:text-emerald-600 rounded-lg shadow-sm transition-all"><Edit3 className="w-4 h-4"/></button>
                           <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 bg-white text-gray-400 hover:text-red-600 rounded-lg shadow-sm transition-all"><Trash2 className="w-4 h-4"/></button>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" /> Team Management</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {teamMembers.map(member => (
                      <div key={member.id} className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 group">
                        <img src={member.image} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
                        <div className="flex-grow">
                          <h4 className="font-black text-sm text-gray-900">{member.name}</h4>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{member.role}</p>
                        </div>
                        <button onClick={() => setEditingTeam(member)} className="p-2 bg-white text-gray-400 hover:text-emerald-600 rounded-lg shadow-sm transition-all"><Edit3 className="w-4 h-4"/></button>
                      </div>
                    ))}
                  </div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-8">
                <div>
                   <h3 className="text-xl font-black mb-6">Home Section Visibility</h3>
                   <div className="grid grid-cols-1 gap-4">
                     <button 
                       onClick={() => onUpdateSiteSettings({...siteSettings, showMegaSale: !siteSettings.showMegaSale})}
                       className={`p-5 rounded-[2rem] border-2 flex items-center justify-between transition-all group ${siteSettings.showMegaSale ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                     >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${siteSettings.showMegaSale ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            {siteSettings.showMegaSale ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                          </div>
                          <div className="text-left">
                            <p className="font-black text-xs uppercase tracking-widest">Mega Sale & Weekly Offers</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">{siteSettings.showMegaSale ? 'Visible to customers' : 'Hidden from customers'}</p>
                          </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-all ${siteSettings.showMegaSale ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${siteSettings.showMegaSale ? 'right-1' : 'left-1'}`} />
                        </div>
                     </button>

                     <button 
                       onClick={() => onUpdateSiteSettings({...siteSettings, showFlashSale: !siteSettings.showFlashSale})}
                       className={`p-5 rounded-[2rem] border-2 flex items-center justify-between transition-all group ${siteSettings.showFlashSale ? 'bg-orange-50 border-orange-500' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                     >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${siteSettings.showFlashSale ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            {siteSettings.showFlashSale ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                          </div>
                          <div className="text-left">
                            <p className="font-black text-xs uppercase tracking-widest">Grand Launching Offer</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">{siteSettings.showFlashSale ? 'Visible to customers' : 'Hidden from customers'}</p>
                          </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-all ${siteSettings.showFlashSale ? 'bg-orange-600' : 'bg-gray-300'}`}>
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${siteSettings.showFlashSale ? 'right-1' : 'left-1'}`} />
                        </div>
                     </button>
                   </div>
                </div>

                <div>
                   <h3 className="text-xl font-black mb-6">About Us CMS</h3>
                   <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Title</label>
                        <input type="text" value={aboutContent.title} onChange={e => onUpdateAbout({...aboutContent, title: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 outline-none font-bold" />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Description</label>
                        <textarea value={aboutContent.description} onChange={e => onUpdateAbout({...aboutContent, description: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 outline-none font-bold h-32 resize-none" />
                     </div>
                     <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/10">Publish Updates</button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Team Member Editor Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditingTeam(null)} />
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 shadow-2xl no-scrollbar">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black tracking-tighter">Team Member Editor</h3>
               <button onClick={() => setEditingTeam(null)} className="p-2 bg-gray-50 rounded-full"><X className="w-5 h-5"/></button>
             </div>
             <div className="space-y-6 mb-10">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Full Name</label>
                  <input type="text" value={editingTeam.name} onChange={e => setEditingTeam({...editingTeam, name: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Designation / Role</label>
                  <input type="text" value={editingTeam.role} onChange={e => setEditingTeam({...editingTeam, role: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Profile Image URL</label>
                  <input type="text" placeholder="https://..." value={editingTeam.image} onChange={e => setEditingTeam({...editingTeam, image: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                  <div className="mt-4 w-32 h-40 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mx-auto">
                    {editingTeam.image ? <img src={editingTeam.image} className="h-full w-full object-cover" /> : <UserIcon className="w-8 h-8 text-gray-200 m-auto mt-16" />}
                  </div>
                </div>
             </div>
             <button onClick={() => handleSaveTeamMember(editingTeam)} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">Save Changes</button>
          </div>
        </div>
      )}

      {/* Gallery Editor Modal */}
      {editingGallery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditingGallery(null)} />
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 shadow-2xl no-scrollbar">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black tracking-tighter">Gallery Look Editor</h3>
               <button onClick={() => setEditingGallery(null)} className="p-2 bg-gray-50 rounded-full"><X className="w-5 h-5"/></button>
             </div>
             <div className="space-y-6 mb-10">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Image URL</label>
                  <input type="text" placeholder="https://..." value={editingGallery.url} onChange={e => setEditingGallery({...editingGallery, url: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                  <div className="mt-4 aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {editingGallery.url ? <img src={editingGallery.url} className="h-full w-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-200" />}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Caption / Description</label>
                  <textarea placeholder="e.g. Traditional Kurta Style" value={editingGallery.caption} onChange={e => setEditingGallery({...editingGallery, caption: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold h-24 resize-none" />
                </div>
             </div>
             <button onClick={() => handleSaveGalleryItem(editingGallery)} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">Save Gallery Item</button>
          </div>
        </div>
      )}

      {/* Slide Editor Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditingSlide(null)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 shadow-2xl no-scrollbar">
             <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black tracking-tighter">Hero Slide Editor</h3>
               <button onClick={() => setEditingSlide(null)} className="p-2 bg-gray-50 rounded-full"><X className="w-5 h-5"/></button>
             </div>
             <div className="space-y-6 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Slide Tagline</label>
                    <input type="text" placeholder="e.g. Winter Collection" value={editingSlide.tagline} onChange={e => setEditingSlide({...editingSlide, tagline: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">CTA Label</label>
                    <input type="text" placeholder="e.g. Shop Now" value={editingSlide.cta} onChange={e => setEditingSlide({...editingSlide, cta: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Headline Title</label>
                  <input type="text" placeholder="e.g. Elevate Your Style" value={editingSlide.title} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Subtitle / Info</label>
                  <textarea placeholder="Brief description for the slide..." value={editingSlide.subtitle} onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold h-24 resize-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Background Image URL</label>
                  <input type="text" placeholder="https://..." value={editingSlide.image} onChange={e => setEditingSlide({...editingSlide, image: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                  <div className="mt-2 h-32 w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {editingSlide.image ? <img src={editingSlide.image} className="h-full w-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-200" />}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Destination Route</label>
                  <input type="text" placeholder="#/shop?category=electronics" value={editingSlide.route} onChange={e => setEditingSlide({...editingSlide, route: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                </div>
             </div>
             <button onClick={() => handleSaveSlide(editingSlide)} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">Save Hero Slide</button>
          </div>
        </div>
      )}

      {/* Category Editor Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditingCategory(null)} />
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 shadow-2xl no-scrollbar">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black tracking-tighter">Category Editor</h3>
               <button onClick={() => setEditingCategory(null)} className="p-2 bg-gray-50 rounded-full"><X className="w-5 h-5"/></button>
             </div>
             <div className="space-y-6 mb-10">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Icon</label>
                    <input type="text" placeholder="👕" value={editingCategory.icon} onChange={e => setEditingCategory({...editingCategory, icon: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold text-center text-xl" />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Category Name</label>
                    <input type="text" placeholder="e.g. Mens Fashion" value={editingCategory.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Display Image URL</label>
                  <input type="text" placeholder="https://..." value={editingCategory.image} onChange={e => setEditingCategory({...editingCategory, image: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                  <div className="mt-4 aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {editingCategory.image ? <img src={editingCategory.image} className="h-full w-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-200" />}
                  </div>
                </div>
                {!categories.find(c => c.id === editingCategory.id) && (
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Unique ID (URL Friendly)</label>
                    <input type="text" placeholder="e.g. mens-fashion" value={editingCategory.id} onChange={e => setEditingCategory({...editingCategory, id: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-bold" />
                  </div>
                )}
             </div>
             <button onClick={() => handleSaveCategory(editingCategory)} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">Save Category</button>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditingProduct(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 shadow-2xl no-scrollbar">
             <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black tracking-tighter">Product Editor</h3>
               <button onClick={() => setEditingProduct(null)} className="p-2 bg-gray-50 rounded-full"><X className="w-5 h-5"/></button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <input type="text" placeholder="Title" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl font-bold" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Price" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="p-4 bg-gray-50 border rounded-2xl font-bold" />
                    <input type="number" placeholder="Special Price" value={editingProduct.specialPrice || ''} onChange={e => setEditingProduct({...editingProduct, specialPrice: Number(e.target.value)})} className="p-4 bg-gray-50 border rounded-2xl font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Category</label>
                    <select 
                      value={editingProduct.category} 
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} 
                      className="w-full p-4 bg-gray-50 border rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/10"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <input type="text" placeholder="Color Code (e.g. #FF0000)" value={editingProduct.colorCode || ''} onChange={e => setEditingProduct({...editingProduct, colorCode: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl font-bold" />
                  <input type="number" placeholder="Stock Quantity" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} className="w-full p-4 bg-gray-50 border rounded-2xl font-bold" />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Description</label>
                   <textarea placeholder="Product Description..." value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl h-32 resize-none font-bold mb-4" />
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Product Highlights (One per line)</label>
                   <textarea 
                    placeholder="e.g. 100% Cotton&#10;Water Resistant&#10;Free Warranty" 
                    value={editingProduct.highlights?.join('\n') || ''} 
                    onChange={e => setEditingProduct({...editingProduct, highlights: e.target.value.split('\n').filter(line => line.trim() !== '')})} 
                    className="w-full p-4 bg-gray-50 border rounded-2xl h-32 resize-none font-bold" 
                   />
                </div>
             </div>
             <button onClick={() => { onUpdateProducts(products.some(x => x.id === editingProduct.id) ? products.map(x => x.id === editingProduct.id ? editingProduct : x) : [...products, editingProduct]); setEditingProduct(null); }} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-900/10">Save Product Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
