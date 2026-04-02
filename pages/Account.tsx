
import React, { useState, useRef } from 'react';
import { User as UserIcon, Heart, Package, LogOut, ChevronRight, Settings, MapPin, CreditCard, X, Camera, Loader2, Save, Trash2, Upload, AlertTriangle } from 'lucide-react';
import { Product, AppRoute, User, Order } from '../types';

interface AccountProps {
  onNavigate: (route: string) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onLogout: () => void;
  user: User;
  onUpdateUser: (user: User) => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  allOrders: Order[];
}

const Account: React.FC<AccountProps> = ({ onNavigate, wishlist, onToggleWishlist, onAddToCart, onLogout, user, onUpdateUser, orders, onUpdateOrders, allOrders }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'settings' | 'addresses' | 'payments'>('profile');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: user.name, phone: user.phone || '' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Addresses Mock State
  const [addresses, setAddresses] = useState([
    { id: '1', title: 'Home', address: 'Baldia Town, Karachi' },
    { id: '2', title: 'Office', address: 'DHA Phase 6, Karachi' }
  ]);

  const handleProfileSave = () => {
    onUpdateUser({ ...user, name: editData.name, phone: editData.phone });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // CRITICAL: Check file size (Max 1.5MB to fit within LocalStorage safely with other data)
    const MAX_SIZE = 1.5 * 1024 * 1024; 
    if (file.size > MAX_SIZE) {
      setUploadError("Image is too large. Please select a file smaller than 1.5MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const base64String = reader.result as string;
        onUpdateUser({ ...user, avatar: base64String });
        setIsUploading(false);
      } catch (err) {
        setUploadError("Failed to process image. Try a different format.");
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setUploadError("Error reading file.");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      const updated = allOrders.map(o => o.id === orderId ? { ...o, status: 'cancelled' as const } : o);
      onUpdateOrders(updated);
      setSelectedOrder(null);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Profile Picture & Welcome Section */}
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-50 bg-gray-100 shadow-inner flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-12 h-12 text-gray-300" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all transform group-hover:scale-110 active:scale-95 border-4 border-white"
                  title="Update Profile Picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleAvatarChange} 
                />
              </div>
              <div className="text-center md:text-left flex-grow">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Welcome, {user.name}!</h2>
                <p className="text-gray-500 font-medium">Manage your SubKuch experience from this hub.</p>
                {uploadError && (
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 animate-shake">
                    <AlertTriangle className="w-3 h-3" /> {uploadError}
                  </div>
                )}
                <div className="flex gap-2 mt-3 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                  {user.phone && <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">{user.phone}</span>}
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                 <h2 className="text-2xl font-black tracking-tight">Personal Details</h2>
                 {!isEditing ? (
                   <button onClick={() => setIsEditing(true)} className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">Edit Profile</button>
                 ) : (
                   <div className="flex gap-4">
                     <button onClick={handleProfileSave} className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl transition-all">
                       <Save className="w-4 h-4"/> Save Changes
                     </button>
                     <button onClick={() => setIsEditing(false)} className="text-gray-400 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl">Cancel</button>
                   </div>
                 )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    {isEditing ? (
                      <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 outline-none font-bold text-gray-900" />
                    ) : (
                      <div className="p-4 bg-gray-50/50 rounded-2xl font-bold text-gray-900 border border-gray-100/50">{user.name}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    {isEditing ? (
                      <input type="tel" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 outline-none font-bold text-gray-900" />
                    ) : (
                      <div className="p-4 bg-gray-50/50 rounded-2xl font-bold text-gray-900 border border-gray-100/50">{user.phone || 'Not provided'}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address (Read-only)</label>
                  <div className="p-4 bg-gray-50/50 rounded-2xl font-bold text-gray-400 border border-gray-100/50 cursor-not-allowed">{user.email}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div onClick={() => setActiveTab('addresses')} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-200 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><MapPin className="w-6 h-6" /></div>
                  <div><h4 className="font-black text-gray-900">Shipping Addresses</h4><p className="text-xs text-gray-500 font-medium">{addresses.length} saved locations</p></div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div onClick={() => setActiveTab('payments')} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-200 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><CreditCard className="w-6 h-6" /></div>
                  <div><h4 className="font-black text-gray-900">Payment Methods</h4><p className="text-xs text-gray-500 font-medium">Manage cards & wallets</p></div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          </div>
        );
      case 'addresses':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Saved Addresses</h3>
              <button className="text-emerald-600 font-black text-xs uppercase tracking-widest">Add New</button>
            </div>
            {addresses.map(addr => (
              <div key={addr.id} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"><MapPin className="w-5 h-5 text-gray-400" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{addr.title}</h4>
                    <p className="text-sm text-gray-500">{addr.address}</p>
                  </div>
                </div>
                <button className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition-all"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Purchase History</h3>
            {orders.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100 border-dashed">
                <Package className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">No orders found</h4>
                <p className="text-gray-500 mb-8">You haven't placed any orders on SubKuch.pk yet.</p>
                <button onClick={() => onNavigate(AppRoute.SHOP)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">Start Shopping</button>
              </div>
            ) : orders.map((order) => (
              <div key={order.id} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">Order #{order.id}</h4>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Placed on {order.date}</p>
                  </div>
                  <span className={`self-start px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 
                    order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6 border-t border-gray-50 pt-6">
                  <div className="flex-grow flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden shadow-sm">
                          <img src={item.images[0]} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{order.items.length} Product(s)</p>
                      <p className="text-sm font-extrabold text-emerald-600">Rs. {order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedOrder(order)} className="w-full sm:w-auto px-6 py-2.5 bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all">View Details</button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'wishlist':
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">My Wishlist</h3>
            <div className="p-12 text-center bg-white rounded-[2.5rem] border border-gray-100 italic text-gray-400">
               Feature arriving soon. You have {wishlist.length} saved items.
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Payment Methods</h3>
            <div className="p-12 text-center bg-white rounded-[2.5rem] border border-gray-100 italic text-gray-400">
               No cards or digital wallets linked yet.
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Nav */}
        <aside className="lg:w-80">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden sticky top-32">
            <div className="p-8 border-b border-gray-50 flex flex-col items-center">
               <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 border border-gray-100">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-emerald-50 flex items-center justify-center font-black text-emerald-600 text-xl">{user.name.charAt(0)}</div>}
               </div>
               <h3 className="font-black text-gray-900 tracking-tighter line-clamp-1">{user.name}</h3>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{user.role}</p>
            </div>
            <div className="py-4">
              {[
                { id: 'profile', icon: UserIcon, label: 'Personal Dashboard' },
                { id: 'orders', icon: Package, label: 'Order History' },
                { id: 'addresses', icon: MapPin, label: 'Shipping Addresses' },
                { id: 'wishlist', icon: Heart, label: 'Favorites Wishlist' },
                { id: 'payments', icon: CreditCard, label: 'Payment Hub' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-4 px-8 py-4 text-left transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white font-black' : 'hover:bg-gray-50 text-gray-500 font-bold'}`}>
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-300'}`} /> 
                  <span className="text-xs uppercase tracking-widest">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-gray-50">
              <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-8 py-4 text-red-500 bg-red-50 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-grow">
          {renderTabContent()}
        </main>
      </div>

      {/* Order Details Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-8 md:p-12 shadow-2xl animate-scaleIn no-scrollbar">
             <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-900"><X /></button>
             
             <div className="mb-10">
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[3px] mb-2">Order Confirmation</p>
               <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Details for #{selectedOrder.id}</h3>
             </div>

             <div className="space-y-6 mb-12">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="font-black text-gray-900 uppercase tracking-widest text-sm">{selectedOrder.status}</p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Placed</p>
                    <p className="font-black text-gray-900 text-sm">{selectedOrder.date}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Purchased Items</h4>
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex gap-5 py-2">
                      <img src={item.images[0]} className="w-14 h-18 object-cover rounded-xl shadow-sm" />
                      <div className="flex-grow py-1">
                        <p className="font-black text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1">{item.quantity} Unit(s) • Rs. {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-emerald-50 rounded-[2rem] space-y-3">
                   <div className="flex justify-between text-xs font-bold text-gray-600"><span>Subtotal</span><span>Rs. {(selectedOrder.total - selectedOrder.shippingCost).toLocaleString()}</span></div>
                   <div className="flex justify-between text-xs font-bold text-gray-600"><span>Shipping</span><span>{selectedOrder.shippingCost > 0 ? `Rs. ${selectedOrder.shippingCost}` : 'FREE'}</span></div>
                   <div className="flex justify-between font-black text-gray-900 text-xl pt-3 border-t border-emerald-100"><span>Grand Total</span><span>Rs. {selectedOrder.total.toLocaleString()}</span></div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-4">
                {selectedOrder.status === 'pending' && (
                  <button onClick={() => handleCancelOrder(selectedOrder.id)} className="flex-grow py-5 border-2 border-red-100 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">Request Cancellation</button>
                )}
                <button onClick={() => setSelectedOrder(null)} className="flex-grow py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Close Details</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
