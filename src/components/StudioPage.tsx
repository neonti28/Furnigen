import React, { useState, useRef, useEffect } from 'react';
import type { DesignInputs, DesignHistoryItem } from '@/types';
import { designService } from '@/services/ai';
import DesignHistoryCard from '@/components/DesignHistoryCard';

const Loader: React.FC<{text: string}> = ({text}) => (
    <div className="flex flex-col justify-center items-center py-12 space-y-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-amber-500 border-t-transparent"></div>
        <p className="text-slate-600 font-medium animate-pulse">{text}</p>
    </div>
);

const CustomDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}> = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg cursor-pointer hover:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all"
      >
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 placeholder-slate-400"
            placeholder="Select or type..."
        />
        <svg className={`h-5 w-5 text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-xl border border-slate-100 max-h-60 overflow-y-auto">
          <ul className="py-1 text-sm text-slate-700">
            {options.map((opt) => (
              <li key={opt}>
                <button
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className="block w-full text-left px-4 py-2 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                    {opt}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const StudioPage: React.FC = () => {
    const [inputs, setInputs] = useState<DesignInputs>({
        function: '',
        style: 'Japandi',
        material: '',
        color: '',
        details: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [designHistory, setDesignHistory] = useState<DesignHistoryItem[]>([]);
    const formRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const handleReuseInputs = (inputsToReuse: DesignInputs) => {
        setInputs(inputsToReuse);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            setLoadingText('Initializing AI Model...');
            const designResult = await designService.generateDesign(inputs, (status) => setLoadingText(status));
            const newHistoryItem: DesignHistoryItem = {
              id: Date.now(),
              inputs: { ...inputs },
              result: designResult,
            };
            setDesignHistory((prev) => [newHistoryItem, ...prev]);
        } catch (err) {
            console.error('Generation error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div className="max-w-7xl mx-auto space-y-16">
      <div ref={formRef} className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Create Your <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Masterpiece</span>
        </h2>
        <p className="text-lg text-slate-600">Combine your vision with our AI to generate detailed furniture specifications, pricing, and manufacturing guides.</p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-100 max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label htmlFor="function" className="block text-sm font-medium text-slate-700 mb-1">Furniture Type</label>
               <div className="absolute inset-y-0 left-0 top-7 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM21 21l-4.35-4.35" /></svg>
               </div>
              <input
                type="text"
                id="function"
                name="function"
                value={inputs.function}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                placeholder="e.g., Dining Chair, Coffee Table"
                required
              />
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 top-7 pl-3.5 flex items-center pointer-events-none">
                     <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <CustomDropdown
                    label="Design Style"
                    value={inputs.style}
                    onChange={(val) => setInputs((prev) => ({ ...prev, style: val }))}
                    options={['Japandi', 'Scandinavian', 'Mid-Century Modern', 'Industrial', 'Minimalist', 'Bohemian', 'Javanese Traditional']}
                />
            </div>

            <div className="relative">
              <label htmlFor="material" className="block text-sm font-medium text-slate-700 mb-1">Primary Material</label>
              <div className="absolute inset-y-0 left-0 top-7 pl-3.5 flex items-center pointer-events-none">
                 <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 01.52 2.9l-1.297 1.296A3.503 3.503 0 009 11.5a3.5 3.5 0 005.002-2.38l1.498-1.497A1.5 1.5 0 1117 9.121l-1.497 1.497A3.5 3.5 0 0013.5 14a3.5 3.5 0 00-2.38 5.002l1.296-1.297A1.5 1.5 0 1114.379 19l-1.297-1.296A3.503 3.503 0 0011.5 15a3.5 3.5 0 00-5.002 2.38L5.001 18.879A1.5 1.5 0 013.5 17l1.497-1.497A3.5 3.5 0 006.5 12a3.5 3.5 0 002.38-5.002L7.583 8.295A1.5 1.5 0 016.5 6l1.296 1.296A3.503 3.503 0 009.5 7a3.5 3.5 0 002.38-5.002L14.379.5A1.5 1.5 0 0117 2l-1.497 1.497A3.5 3.5 0 0013.5 6a3.5 3.5 0 00-2.38-5.002L9.823.5A1.5 1.5 0 0110 3.5z" /></svg>
              </div>
              <input
                type="text"
                id="material"
                name="material"
                value={inputs.material}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                placeholder="e.g., Teak Wood, Rattan, Steel"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="color" className="block text-sm font-medium text-slate-700 mb-1">Color Palette</label>
               <div className="absolute inset-y-0 left-0 top-7 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm12 14H4V4h12v12zM6 6a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2A.5.5 0 016 6zm3.5.5a.5.5 0 000-1h2a.5.5 0 000 1h-2zM6 8a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2A.5.5 0 016 8zm3.5.5a.5.5 0 000-1h2a.5.5 0 000 1h-2zM6 10a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm3.5.5a.5.5 0 000-1h2a.5.5 0 000 1h-2zm-1.5 1.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm3.5.5a.5.5 0 000-1h2a.5.5 0 000 1h-2z" clipRule="evenodd" /></svg>
               </div>
              <input
                type="text"
                id="color"
                name="color"
                value={inputs.color}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                placeholder="e.g., Natural Oak, Matte Black"
              />
            </div>
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-slate-700 mb-1">Additional Details (Optional)</label>
            <textarea
                id="details"
                name="details"
                rows={3}
                value={inputs.details}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                placeholder="e.g., 'Must be stackable', 'Include brass accents', 'Suitable for outdoor use'"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-center">
            <button
                type="submit"
                disabled={isLoading}
                className={`
                    w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5
                    ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-amber-500/30'}
                `}
            >
              {isLoading ? 'Processing...' : 'Generate Design Concept'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12">
        {isLoading && <Loader text={loadingText} />}

        {error && (
            <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                    <h4 className="font-bold">Generation Failed</h4>
                    <p>{error}</p>
                </div>
            </div>
        )}

        {designHistory.length > 0 && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
              <h3 className="text-2xl font-bold text-slate-900">Session History</h3>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">{designHistory.length} Designs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {designHistory.map((item) => (
                <DesignHistoryCard
                  key={item.id}
                  historyItem={item}
                  onReuseInputs={() => handleReuseInputs(item.inputs)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioPage;
