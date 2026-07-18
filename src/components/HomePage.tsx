import React from 'react';
import type { Page } from '@/types';

interface HomePageProps {
  setActivePage: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="p-4 group">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{children}</p>
    </div>
);


const HomePage: React.FC<HomePageProps> = ({ setActivePage }) => {
  return (
    <div className="space-y-24 md:space-y-32">
      {/* Hero Section */}
      <section className="relative text-center pt-10 pb-16 md:pt-16">
        <div className="absolute inset-0 -z-10 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tighter leading-tight mb-6">
          Intelligent Furniture Design, <br />
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Instantly Realized.</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto mb-10">
          Transform your ideas into <span className="text-amber-600 font-semibold">production-ready specifications</span>. Generate BOMs, cost analyses, and stunning visuals in seconds.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setActivePage('studio')}
            className="px-8 py-4 rounded-full bg-slate-800 text-white font-semibold shadow-lg shadow-slate-500/20 hover:bg-slate-900 transition-all hover:-translate-y-1 transform duration-300 w-full sm:w-auto"
          >
            Start Designing Now
          </button>
          <button
            onClick={() => setActivePage('about')}
            className="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold hover:bg-slate-100 transition-all w-full sm:w-auto"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-12 text-center">
                  <FeatureCard
                    icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                    title="AI Concept Generation"
                    >
                    Input your requirements and let our AI generate photorealistic concepts tailored to your unique style.
                  </FeatureCard>
                   <FeatureCard
                    icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M12 8h.01M15 8h.01M15 5h.01M12 5h.01M9 5h.01M4 7h2a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1zm14 0h2a1 1 0 011 1v10a1 1 0 01-1 1h-2a1 1 0 01-1-1V8a1 1 0 011-1z" /></svg>}
                    title="Technical Analysis"
                    >
                    Automatically get a detailed Bill of Materials (BOM), dimension estimates, and step-by-step manufacturing guides.
                  </FeatureCard>
                   <FeatureCard
                    icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    title="Cost Estimation"
                    >
                    Real-time estimates for material costs, labor, and suggested retail pricing to ensure profitability from day one.
                  </FeatureCard>
              </div>
          </div>
      </section>

      {/* Gallery Teaser */}
      <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Latest Creations</h2>
              <p className="text-slate-600 mt-2">Explore what other designers are creating with FurniGen Studio.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800" className="w-full h-80 object-cover rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" alt="Modern Chair" />
              <img src="https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800" className="w-full h-80 object-cover rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 mt-0 md:mt-8" alt="Wooden Table" />
              <img src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800" className="w-full h-80 object-cover rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" alt="Minimalist Lamp" />
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800" className="w-full h-80 object-cover rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 mt-0 md:mt-8" alt="Sleek Sofa" />
          </div>
      </section>
    </div>
  );
};

export default HomePage;
