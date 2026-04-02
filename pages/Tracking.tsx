
import React, { useState } from 'react';
import { Search, Package, Warehouse, Truck, CheckCircle, Clock, AlertCircle, Printer, MapPin, Phone, Mail, FileText, Share2 } from 'lucide-react';
import { Order } from '../types';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface TrackingProps {
  orders: Order[];
}

const Tracking: React.FC<TrackingProps> = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    setIsLoading(true);
    setHasSearched(false);
    setFoundOrder(null);

    // First check local orders prop
    const match = orders.find(o => 
      o.id.toLowerCase() === query || 
      o.customerEmail.toLowerCase() === query
    );

    if (match) {
      setFoundOrder(match);
      setHasSearched(true);
      setIsLoading(false);
    } else {
      // If not found in prop (e.g. guest or different email), try direct fetch by ID
      try {
        // Firestore is case-sensitive for IDs, but our IDs are typically SKP-XXXXXX
        const orderDoc = await getDoc(doc(db, 'orders', query.toUpperCase()));
        if (orderDoc.exists()) {
          setFoundOrder({ ...orderDoc.data(), id: orderDoc.id } as Order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setHasSearched(true);
        setIsLoading(false);
      }
    }
  };

  const stages = [
    { id: 'pending', label: 'Pending Order', icon: Clock },
    { id: 'dispatched', label: 'Dispatched from Warehouse', icon: Warehouse },
    { id: 'shipped', label: 'Handed to Delivery Partner', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const getActiveStageIndex = (status: Order['status']) => {
    if (status === 'cancelled') return -1;
    return stages.findIndex(s => s.id === status);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl animate-fadeIn">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-printable, #invoice-printable * { visibility: visible; }
          #invoice-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 40px;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="text-center mb-12 no-print">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Track Your Order</h1>
        <div className="inline-block bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest border border-emerald-100">
          Order delivery takes 4 to 5 working days
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 mb-12 no-print">
        <form onSubmit={handleSearch} className="relative group max-w-lg mx-auto mb-10">
          <input
            type="text"
            placeholder="Enter Order ID (SKP-XXXXXX) or Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-32 py-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-emerald-500" />
          <button 
            type="submit" 
            disabled={isLoading}
            className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white px-8 rounded-xl font-black text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/10 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {hasSearched && !foundOrder && (
          <div className="text-center p-12 bg-red-50 rounded-3xl border border-red-100 animate-shake">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-black text-red-900">Order Not Found</h3>
            <p className="text-red-600 font-medium">Please check your Order ID or Email and try again.</p>
          </div>
        )}

        {foundOrder && (
          <div className="space-y-12 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-12 border-b border-gray-100">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter capitalize flex items-center gap-2">
                  {foundOrder.status}
                  {foundOrder.status === 'delivered' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                </h2>
              </div>
              <div className="text-center md:text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reference ID</p>
                <h3 className="text-xl font-black text-emerald-600">{foundOrder.id}</h3>
              </div>
            </div>

            {foundOrder.status === 'cancelled' ? (
              <div className="p-8 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h4 className="font-black text-gray-900 text-xl">Order Cancelled</h4>
                <p className="text-gray-500">This order has been cancelled and is no longer being tracked.</p>
              </div>
            ) : (
              <div className="relative pt-10 pb-4 px-4">
                <div className="hidden md:block absolute top-[68px] left-[10%] right-[10%] h-1 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(getActiveStageIndex(foundOrder.status) / (stages.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {stages.map((stage, idx) => {
                    const isActive = idx <= getActiveStageIndex(foundOrder.status);
                    const isCurrent = idx === getActiveStageIndex(foundOrder.status);
                    
                    return (
                      <div key={stage.id} className="relative flex md:flex-col items-center gap-4 text-left md:text-center">
                        <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 rotate-0' : 'bg-gray-50 text-gray-300 rotate-12'}`}>
                          <stage.icon className={`w-6 h-6 ${isCurrent ? 'animate-pulse' : ''}`} />
                        </div>
                        <div className="flex-grow">
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {isActive ? 'Step Completed' : 'Waiting...'}
                          </p>
                          <h4 className={`text-xs font-black leading-tight ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
                            {stage.label}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Courier Status</p>
                  <p className="text-sm font-bold text-gray-900">{foundOrder.status === 'delivered' ? 'Package Received' : 'Processing for Handover'}</p>
                </div>
              </div>

              {foundOrder.status === 'delivered' ? (
                <button 
                  onClick={handlePrint}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  <Printer className="w-4 h-4" /> Download Official Invoice
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-gray-100">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    Invoice available after delivery
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden Professional Invoice Template (Printable Only) */}
      {foundOrder && (
        <div id="invoice-printable" className="hidden">
          <div className="flex justify-between items-start border-b-4 border-emerald-600 pb-10 mb-10">
            <div>
              <h1 className="text-5xl font-black text-emerald-700 tracking-tighter">SubKuch<span className="text-orange-500">.pk</span></h1>
              <p className="text-gray-500 text-sm mt-1 font-bold">Everything in one place.</p>
              <div className="mt-6 text-[11px] space-y-1.5 text-gray-600">
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-600"/> Baldia Town, Near Qazi Hospital, Karachi, Pakistan</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-600"/> 03022634841</p>
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-600"/> support@subkuch.pk</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-widest mb-3">Invoice</h2>
              <div className="space-y-1.5 text-sm">
                <p className="text-gray-500">Invoice No: <span className="font-black text-gray-900">#INV-{foundOrder.id}</span></p>
                <p className="text-gray-500">Issued On: <span className="font-black text-gray-900">{foundOrder.date}</span></p>
                <p className="text-gray-500">Payment Mode: <span className="font-black text-gray-900 uppercase">{foundOrder.paymentMethod}</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16 mb-16">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] border-b border-gray-200 pb-3 mb-4">Recipient Details</h3>
              <p className="text-xl font-black text-gray-900 mb-1">{foundOrder.customerName}</p>
              <p className="text-sm text-gray-600 font-bold">{foundOrder.customerEmail}</p>
              <p className="text-sm text-gray-600 font-bold">{foundOrder.customerPhone}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] border-b border-gray-200 pb-3 mb-4">Destination</h3>
              <p className="text-sm text-gray-900 font-black leading-relaxed">
                {foundOrder.address}<br/>
                {foundOrder.city}, Pakistan
              </p>
            </div>
          </div>

          <table className="w-full text-left border-collapse mb-16">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest rounded-tl-2xl">Description</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-center">Quantity</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-right">Unit Price</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-right rounded-tr-2xl">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {foundOrder.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-6 px-6">
                    <p className="font-black text-gray-900">{item.name}</p>
                    <p className="text-[10px] text-emerald-600 uppercase font-black tracking-widest">{item.category}</p>
                  </td>
                  <td className="py-6 px-6 text-center font-black text-gray-900">{item.quantity}</td>
                  <td className="py-6 px-6 text-right font-bold text-gray-900">Rs. {item.price.toLocaleString()}</td>
                  <td className="py-6 px-6 text-right font-black text-emerald-700">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-10 border-t-2 border-gray-100">
            <div className="w-full max-w-xs space-y-4 bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-700 font-black uppercase tracking-widest">Subtotal</span>
                <span className="font-black text-gray-900">Rs. {(foundOrder.total - foundOrder.shippingCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-700 font-black uppercase tracking-widest">Shipping Fee</span>
                <span className="font-black text-gray-900">{foundOrder.shippingCost > 0 ? `Rs. ${foundOrder.shippingCost}` : 'FREE'}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-emerald-700 pt-5 border-t border-emerald-200">
                <span>Grand Total</span>
                <span>Rs. {foundOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-32 pt-12 border-t border-gray-100 text-center">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Thank you for trusting SubKuch.pk - Pakistan's One-Stop Marketplace</p>
            <p className="text-[10px] text-gray-300">Computer generated document. Valid for return/exchange within 7 days of delivery.</p>
          </div>
        </div>
      )}

      <div className="text-center text-gray-400 no-print">
        <p className="text-sm font-medium">Have questions? <a href="#/contact" className="text-emerald-600 font-black hover:underline">Chat with Support</a></p>
      </div>
    </div>
  );
};

export default Tracking;
