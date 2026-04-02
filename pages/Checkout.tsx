
import React, { useState } from 'react';
import { CreditCard, Truck, CheckCircle, ArrowRight, Lock, MapPin, Smartphone, User, DollarSign } from 'lucide-react';
import { CartItem, AppRoute, Order, User as UserType } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  user: UserType | null;
  onNavigate: (route: string) => void;
  onPlaceOrder: (order: Order) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, user, onNavigate, onPlaceOrder }) => {
  const [step, setStep] = useState(1);
  const [shippingOption, setShippingOption] = useState<'fixed' | 'pay_on_arrival'>('fixed');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: 'Karachi'
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isFreeShipping = cartTotal >= 10000;
  const shippingCharge = isFreeShipping ? 0 : (shippingOption === 'fixed' ? 200 : 0);
  const finalTotal = cartTotal + shippingCharge;

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: 'SKP-' + Math.floor(100000 + Math.random() * 900000),
      items: cart,
      total: finalTotal,
      shippingCost: shippingCharge,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: formData.address,
      city: formData.city,
      date: new Date().toLocaleDateString('en-PK'),
      status: 'pending',
      isNew: true,
      paymentMethod,
      shippingOption
    };
    onPlaceOrder(newOrder);
    setConfirmedOrder(newOrder);
    setStep(3);
  };

  if (step === 3 && confirmedOrder) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fadeIn">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black mb-4">Order Received!</h1>
        <p className="text-gray-500 mb-8">Thank you for shopping with SubKuch.pk</p>
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border shadow-sm space-y-4 mb-8">
           <div className="flex justify-between border-b pb-4"><span>Order ID:</span><span className="font-black text-emerald-600">{confirmedOrder.id}</span></div>
           <div className="flex justify-between border-b pb-4"><span>Total Amount:</span><span className="font-black">Rs. {confirmedOrder.total.toLocaleString()}</span></div>
           <p className="text-xs text-gray-400">A confirmation has been sent to {confirmedOrder.customerEmail}</p>
        </div>
        <button onClick={() => onNavigate(AppRoute.HOME)} className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-black">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleOrder} className="space-y-10">
              {step === 1 ? (
                <div className="space-y-8 animate-fadeIn">
                  <h2 className="text-2xl font-black flex items-center gap-3"><Truck className="text-emerald-600" /> Shipping Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" required placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl font-bold" />
                    <input type="text" required placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl font-bold" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="tel" required placeholder="Phone (e.g., 03022634841)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl font-bold" />
                    <input type="email" required placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl font-bold" />
                  </div>
                  <textarea required placeholder="Address (Baldia Town, Karachi, etc.)" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl h-32 font-bold"></textarea>
                  
                  {!isFreeShipping && (
                    <div className="p-6 bg-emerald-50 rounded-3xl space-y-4">
                      <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Select Shipping Preference</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${shippingOption === 'fixed' ? 'border-emerald-500 bg-white' : 'border-gray-100 bg-white/50'}`}>
                           <input type="radio" name="ship" checked={shippingOption === 'fixed'} onChange={() => setShippingOption('fixed')} className="accent-emerald-600" />
                           <div><p className="font-bold text-sm">Add 200 PKR to Total</p><p className="text-[10px] text-gray-400">Faster Processing</p></div>
                         </label>
                         <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${shippingOption === 'pay_on_arrival' ? 'border-emerald-500 bg-white' : 'border-gray-100 bg-white/50'}`}>
                           <input type="radio" name="ship" checked={shippingOption === 'pay_on_arrival'} onChange={() => setShippingOption('pay_on_arrival')} className="accent-emerald-600" />
                           <div><p className="font-bold text-sm">Pay Partner on Arrival</p><p className="text-[10px] text-gray-400">Standard Delivery</p></div>
                         </label>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8 animate-fadeIn">
                  <h2 className="text-2xl font-black flex items-center gap-3"><DollarSign className="text-emerald-600" /> Payment</h2>
                  <div className="space-y-4">
                    <label className={`flex items-center gap-5 p-8 rounded-[2rem] border-2 cursor-pointer ${paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-50'}`}>
                      <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                      <div className="font-black">Cash on Delivery (COD)</div>
                    </label>
                  </div>
                </div>
              )}
              <div className="flex justify-between pt-8">
                {step === 2 && <button type="button" onClick={() => setStep(1)} className="text-gray-400 font-bold">Back</button>}
                <button type="submit" className="ml-auto bg-emerald-600 text-white px-12 py-4 rounded-2xl font-black shadow-lg">
                  {step === 1 ? 'Proceed to Payment' : 'Complete Order'}
                </button>
              </div>
            </form>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-8 border sticky top-32">
              <h3 className="font-black text-xl mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6 border-b pb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.name} x {item.quantity}</span>
                    <span className="font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-bold">Rs. {cartTotal.toLocaleString()}</span></div>
                 <div className="flex justify-between text-sm"><span>Shipping</span><span className="text-emerald-600 font-bold">{isFreeShipping ? 'FREE' : (shippingOption === 'fixed' ? 'Rs. 200' : 'Pay on Arrival')}</span></div>
                 <div className="flex justify-between text-2xl font-black pt-4 border-t"><span>Total</span><span>Rs. {finalTotal.toLocaleString()}</span></div>
                 <p className="text-[10px] text-gray-400 mt-4 text-center font-bold uppercase tracking-widest">Fixed 200 PKR delivery / Free over 10,000 PKR</p>
              </div>
            </div>
          </div>
       </div>
    </div>
  );
};

export default Checkout;
