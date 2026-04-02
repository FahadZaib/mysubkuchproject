import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Youtube, ExternalLink } from 'lucide-react';
import { AppRoute } from '../types';
import { CATEGORIES } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white tracking-tighter">
              SubKuch<span className="text-emerald-500">.pk</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Pakistan's favorite one-stop marketplace. We bring "Everything in one place" with a commitment to quality and fast delivery.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, color: 'hover:bg-blue-600', url: '#' },
                { icon: Instagram, color: 'hover:bg-pink-600', url: '#' },
                { icon: Twitter, color: 'hover:bg-sky-500', url: '#' },
                { icon: Youtube, color: 'hover:bg-red-600', url: '#' }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.url}
                  className={`w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center transition-all duration-300 ${social.color} hover:text-white group`}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-white font-black mb-7 text-[10px] uppercase tracking-[3px]">Shop Categories</h3>
            <ul className="grid grid-cols-1 gap-4">
              {CATEGORIES.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <a 
                    href={`${AppRoute.SHOP}?category=${cat.id}`} 
                    className="text-sm hover:text-emerald-500 hover:translate-x-1 transition-all inline-block flex items-center gap-2"
                  >
                    <span className="text-xs opacity-50">{cat.icon}</span>
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-white font-black mb-7 text-[10px] uppercase tracking-[3px]">Customer Care</h3>
            <ul className="space-y-4 text-sm">
              {[
                { label: 'Track Your Order', route: AppRoute.TRACKING },
                { label: 'Contact Support', route: AppRoute.CONTACT },
                { label: 'Our Story', route: AppRoute.ABOUT },
                { label: 'Marketplace Policy', route: '#' },
                { label: 'Terms of Service', route: '#' }
              ].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.route} 
                    className="hover:text-emerald-500 transition-colors flex items-center gap-2 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-black mb-7 text-[10px] uppercase tracking-[3px]">Get In Touch</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold mb-0.5">Location</p>
                  <p className="text-xs text-gray-400">Baldia Town, Near Qazi Hospital, Karachi, Pakistan.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold mb-0.5">Phone</p>
                  <p className="text-xs text-gray-400">03022634841</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold mb-0.5">Email</p>
                  <p className="text-xs text-gray-400">fahadzaib192021@gmail.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            &copy; 2024 SubKuch.pk Marketplace. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">
              Proudly Pakistani 🇵🇰
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;