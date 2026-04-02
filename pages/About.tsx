
import React from 'react';
import { Target, Users, ShieldCheck, Heart, Linkedin, Twitter, Mail } from 'lucide-react';
import { TeamMember } from '../types';

interface AboutProps {
  content: {
    title: string;
    description: string;
    image: string;
    stats: { customers: string; products: string };
  };
  teamMembers?: TeamMember[];
}

const About: React.FC<AboutProps> = ({ content, teamMembers = [] }) => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-emerald-900 py-24 text-center text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            {content.title.split('.').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}{i < arr.length - 1 ? '.' : ''}
                {i === 0 && <br/>}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-xl text-emerald-50 max-w-2xl mx-auto opacity-80 leading-relaxed">
            {content.description}
          </p>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
      </section>

      {/* Story Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Our Story</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Founded in Karachi, SubKuch.pk started with a simple vision: to make quality products accessible to every household across Pakistan. We realized that shopping shouldn't be a hassle of visiting multiple stores or websites.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Today, we serve thousands of customers daily, offering everything from the latest gadgets to daily kitchen essentials, all under one virtual roof.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <h4 className="text-3xl font-black text-emerald-600">{content.stats.customers}</h4>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Happy Customers</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-emerald-600">{content.stats.products}</h4>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Products</p>
              </div>
            </div>
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[500px]">
            <img src={content.image} alt="Our Team" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-24 bg-white border-t border-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[4px] block mb-2">The Brains</span>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Meet Our Experts</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="group flex flex-col items-center">
                  <div className="relative w-full aspect-[4/5] mb-6 rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-lg border-8 border-white group-hover:shadow-2xl transition-all duration-500">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-8">
                       <div className="flex gap-4">
                          <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-900 hover:bg-emerald-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-[50ms] shadow-lg"><Linkedin className="w-4 h-4"/></button>
                          <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-900 hover:bg-emerald-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-[100ms] shadow-lg"><Twitter className="w-4 h-4"/></button>
                          <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-900 hover:bg-emerald-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-[150ms] shadow-lg"><Mail className="w-4 h-4"/></button>
                       </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="bg-gray-100 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16 tracking-tighter">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Quality First", desc: "Every product is handpicked and verified for quality before it reaches you." },
              { icon: ShieldCheck, title: "Trustworthy", desc: "100% secure payments and genuine product guarantees on every order." },
              { icon: Users, title: "Customer Obsession", desc: "Our 24/7 support team is always ready to assist you with a smile." },
              { icon: Heart, title: "Made for Pakistan", desc: "Tailored shopping experience designed specifically for the local market." }
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] text-center space-y-4 hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-gray-900">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
