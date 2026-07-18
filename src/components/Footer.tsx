import React from 'react';
import type { Page } from '@/types';

interface FooterProps {
  setActivePage: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-slate-800 pb-10">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2.5 mb-4">
                 <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                   </svg>
                </div>
                <span className="text-xl font-bold tracking-tight">FurniGen Studio</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering local furniture artisans with Artificial Intelligence. Design, analyze, and produce with confidence.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Navigate</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><button onClick={() => setActivePage('home')} className="hover:text-amber-400 transition-colors">Home</button></li>
              <li><button onClick={() => setActivePage('studio')} className="hover:text-amber-400 transition-colors">Studio</button></li>
              <li><button onClick={() => setActivePage('dashboard')} className="hover:text-amber-400 transition-colors">Dashboard</button></li>
               <li><button onClick={() => setActivePage('about')} className="hover:text-amber-400 transition-colors">About Us</button></li>
            </ul>
          </div>
          <div>
             <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Contact</h3>
             <p className="text-slate-300 text-sm hover:text-amber-400 transition-colors"><a href="mailto:support@furnigen.studio">support@furnigen.studio</a></p>
          </div>
        </div>
        <div className="pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} FurniGen Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
