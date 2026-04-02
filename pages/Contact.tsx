
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { ContactQuery } from '../types';

interface ContactProps {
  onSubmit: (query: ContactQuery) => void;
}

const Contact: React.FC<ContactProps> = ({ onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    onSubmit({
      ...form,
      id: 'q' + Date.now(),
      date: new Date().toLocaleDateString('en-PK')
    });
    setSubmitted(true);
  };

  return (
    <div className="animate-fadeIn pb-24">
      <section className="bg-emerald-600 py-24 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">Get In Touch</h1>
          <p className="text-emerald-50 text-lg opacity-80">We'd love to hear from you. Our team is here to help.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/3 bg-gray-900 p-12 text-white space-y-12">
            <div>
              <h2 className="text-3xl font-black mb-6 tracking-tighter">Information</h2>
              <p className="text-gray-400">Baldia Town, Near Qazi Hospital, Karachi, Pakistan.</p>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-6"><Phone className="text-emerald-500" /><div><p className="text-xs font-bold text-emerald-500 uppercase">Call Us</p><p className="font-bold">03022634841</p></div></div>
              <div className="flex items-center gap-6"><Mail className="text-emerald-500" /><div><p className="text-xs font-bold text-emerald-500 uppercase">Email Us</p><p className="font-bold">fahadzaib192021@gmail.com</p></div></div>
            </div>
          </div>

          <div className="flex-grow p-12">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Send className="w-16 h-16 text-emerald-500 mb-4" />
                <h2 className="text-3xl font-black">Message Sent!</h2>
                <button onClick={() => setSubmitted(false)} className="mt-8 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" required placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl" />
                <input type="email" required placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl" />
                <input type="text" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl" />
                <textarea required placeholder="How can we help you?" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl h-40" />
                <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
