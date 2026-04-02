
import React from 'react';
import { 
  FileText, Code, Palette, Layout, Server, Database, CheckCircle, 
  ArrowRight, Smartphone, ShieldCheck, Printer, Globe, Zap, Users
} from 'lucide-react';

const ProjectReport: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen font-['Inter']">
      {/* Styles for Professional PDF Look */}
      <style>{`
        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          #report-container { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      {/* Header Info (No-Print) */}
      <div className="no-print bg-slate-900 text-white py-4 text-center">
        <p className="text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3">
          <FileText className="w-4 h-4 text-emerald-400" /> 
          Developer Handoff Document Mode 
          <button 
            onClick={handlePrint}
            className="ml-4 bg-emerald-600 px-4 py-1.5 rounded-lg hover:bg-emerald-500 transition-all flex items-center gap-2"
          >
            <Printer className="w-3 h-3" /> Save to PDF
          </button>
        </p>
      </div>

      <div id="report-container" className="container mx-auto px-8 py-20 max-w-5xl">
        {/* Cover Page */}
        <section className="text-center mb-32">
          <div className="mb-10 inline-block bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full font-black text-xs uppercase tracking-[4px]">
            Technical Specification 2024
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
            SubKuch<span className="text-emerald-600">.pk</span><br/> Marketplace Architecture
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
            A comprehensive overview of features, design systems, and technical requirements for the development of Pakistan's premier multi-vendor marketplace.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <Globe className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Target Market</p>
              <p className="font-bold">Pakistan (Nationwide)</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <Zap className="w-8 h-8 text-orange-500 mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">AI Model</p>
              <p className="font-bold">Gemini 3 Flash</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">User Base</p>
              <p className="font-bold">B2C Marketplace</p>
            </div>
          </div>
        </section>

        {/* Feature Overview Section */}
        <section className="mb-32 page-break">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-grow bg-slate-200" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[5px]">01. Key Features</h2>
            <div className="h-px flex-grow bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Layout className="text-emerald-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">Multi-Role Dashboard</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    A centralized CMS for administrators to manage inventory, categories, orders, and customer queries in real-time. Role-based access ensures security.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Smartphone className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">Secure OTP Verification</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Dual-verification system (SMS/Email) using simulated OTP logic to secure registrations and high-value transactions.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Zap className="text-orange-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">AI-Grounded Search</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Uses Google Gemini 3 Flash to provide context-aware search results, allowing users to find products using natural conversational language.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">Real-time Order Tracking</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Dynamic order lifecycle visualizer and professional PDF invoice generator for delivered goods.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Identity Section */}
        <section className="mb-32 page-break">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-grow bg-slate-200" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[5px]">02. Design System</h2>
            <div className="h-px flex-grow bg-slate-200" />
          </div>

          <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-2xl font-black mb-6">Color Palette</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-emerald-600 rounded-2xl shadow-lg border-4 border-white" />
                    <div>
                      <p className="font-black text-sm text-slate-900">Emerald Primary</p>
                      <p className="text-xs text-slate-400 font-mono">#10B981</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-orange-500 rounded-2xl shadow-lg border-4 border-white" />
                    <div>
                      <p className="font-black text-sm text-slate-900">Safety Orange</p>
                      <p className="text-xs text-slate-400 font-mono">#F97316</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-900 rounded-2xl shadow-lg border-4 border-white" />
                    <div>
                      <p className="font-black text-sm text-slate-900">Deep Slate (Text)</p>
                      <p className="text-xs text-slate-400 font-mono">#0F172A</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-6">Typography</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main Font: INTER</p>
                    <p className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">SubKuch</p>
                    <p className="text-lg font-medium text-slate-500">Everything in one place.</p>
                  </div>
                  <div className="pt-6 border-t border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Button Styles</p>
                    <div className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest inline-block">Primary CTA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Stack Section */}
        <section className="mb-32 page-break">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-grow bg-slate-200" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[5px]">03. Tech Stack</h2>
            <div className="h-px flex-grow bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-slate-100 rounded-3xl bg-white shadow-sm flex items-start gap-6">
              <Code className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <h4 className="font-black text-lg mb-2">Frontend Engine</h4>
                <ul className="text-sm text-slate-500 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> React 19 (ES6 Modules)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> Tailwind CSS v3</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> Lucide Iconography</li>
                </ul>
              </div>
            </div>
            <div className="p-8 border border-slate-100 rounded-3xl bg-white shadow-sm flex items-start gap-6">
              <Server className="w-8 h-8 text-purple-500 shrink-0" />
              <div>
                <h4 className="font-black text-lg mb-2">AI Implementation</h4>
                <ul className="text-sm text-slate-500 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> Google Gemini API</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> Grounded Search Context</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> Predictive Recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Database Architecture */}
        <section className="mb-32 page-break">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-grow bg-slate-200" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[5px]">04. Relational Database Schema</h2>
            <div className="h-px flex-grow bg-slate-200" />
          </div>

          <div className="p-12 bg-slate-900 rounded-[3rem] text-white">
            <div className="flex items-center gap-4 mb-10">
              <Database className="w-8 h-8 text-emerald-400" />
              <h3 className="text-3xl font-black">MySQL Data Models</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-4">Table: Products</h4>
                  <ul className="text-xs font-mono space-y-2 opacity-80">
                    <li>id: VARCHAR(50) [PK]</li>
                    <li>name: VARCHAR(255)</li>
                    <li>price: DECIMAL(10,2)</li>
                    <li>category_id: VARCHAR(50) [FK]</li>
                    <li>stock: INT</li>
                  </ul>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-4">Table: Users</h4>
                  <ul className="text-xs font-mono space-y-2 opacity-80">
                    <li>id: VARCHAR(50) [PK]</li>
                    <li>email: VARCHAR(150) [UNIQUE]</li>
                    <li>phone: VARCHAR(20)</li>
                    <li>role: ENUM('admin', 'user')</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-4">Table: Orders</h4>
                  <ul className="text-xs font-mono space-y-2 opacity-80">
                    <li>id: VARCHAR(20) [PK]</li>
                    <li>user_id: VARCHAR(50) [FK]</li>
                    <li>total: DECIMAL(10,2)</li>
                    <li>status: ENUM('pending', 'shipped'...)</li>
                  </ul>
                </div>
                <div className="bg-emerald-500/10 p-8 rounded-3xl border border-emerald-500/30 flex items-center justify-center text-center">
                  <p className="text-sm font-bold text-emerald-300 italic">
                    "This schema supports 100,000+ SKU capacity with normalized relationships."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer/Contact */}
        <section className="text-center pt-20 border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] mb-4">Project Representative</p>
          <div className="flex flex-col items-center">
             <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-2xl mb-4">F</div>
             <h4 className="text-xl font-black text-slate-900">M. Fahad Zaib</h4>
             <p className="text-sm text-slate-500">Lead Technical Architect • SubKuch.pk</p>
             <p className="mt-6 text-xs text-slate-300 font-bold uppercase tracking-widest">© 2024 All Rights Reserved</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectReport;
