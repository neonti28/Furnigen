import React, { useState } from 'react';
import type { DesignData } from '@/types';
import { generatePdf } from '@/services/pdfService';
import ImageModal from '@/components/ImageModal';
import BabylonViewer from '@/components/BabylonViewer';

const TabButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`relative pb-3 px-4 text-sm font-semibold transition-colors whitespace-nowrap ${
            active ? 'text-amber-600' : 'text-slate-500 hover:text-slate-700'
        }`}
    >
        {children}
        {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full"></span>}
    </button>
);

const ListItemParser: React.FC<{ text: string; ordered?: boolean }> = ({ text, ordered = false }) => {
    const items = text.split('\n').filter((line) => line.trim() !== '');
    const ListTag = ordered ? 'ol' : 'ul';

    return (
        <ListTag className={`space-y-3 text-slate-700 ${ordered ? 'list-decimal' : 'list-disc'} pl-5`}>
            {items.map((item, index) => {
                const cleanItem = item.trim().replace(/^-|\d+\.\s*/, '');
                return (
                    <li key={index} dangerouslySetInnerHTML={{ __html: cleanItem }}></li>
                );
            })}
        </ListTag>
    );
};

const DesignResult: React.FC<{ result: DesignData }> = ({ result }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'bom' | 'manufacturing' | '3d'>('overview');
    const [includeCosts, setIncludeCosts] = useState(true);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const totalCost = result.materialCost + result.manufacturingCost + result.finishingQCCost;
    const profit = result.salePrice - totalCost;
    const margin = result.salePrice > 0 ? (profit / result.salePrice) * 100 : 0;

    const bomItems = result.bom.split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
            const cleanedLine = line.trim().replace(/^-/, '').trim();
            const parts = cleanedLine.split(':');
            return {
                component: parts[0]?.trim() || '',
                material: parts.slice(1).join(':').trim() || 'N/A'
            };
        });

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div
                        className="bg-slate-100 rounded-xl overflow-hidden aspect-square relative group cursor-pointer"
                        onClick={() => setIsImageModalOpen(true)}
                    >
                        <img
                            src={result.imageUrl}
                            alt={result.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-opacity">Enlarge Image</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M12 8h.01M15 8h.01M15 5h.01M12 5h.01M9 5h.01M4 7h2a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1zm14 0h2a1 1 0 011 1v10a1 1 0 01-1 1h-2a1 1 0 01-1-1V8a1 1 0 011-1z" /></svg>
                            Cost Analysis
                        </h3>
                        <div className="space-y-2 text-sm">
                             <div className="flex justify-between">
                                <span className="text-slate-600">Material Cost</span>
                                <span className="font-medium">${result.materialCost.toLocaleString('en-US')}</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-600">Manufacturing Cost</span>
                                <span className="font-medium">${result.manufacturingCost.toLocaleString('en-US')}</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-600">Finishing & QC</span>
                                <span className="font-medium">${result.finishingQCCost.toLocaleString('en-US')}</span>
                             </div>
                             <div className="border-t border-slate-300 my-2 pt-2 flex justify-between font-bold text-slate-900">
                                <span>Total Production</span>
                                <span>${totalCost.toLocaleString('en-US')}</span>
                             </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-dashed border-slate-300">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-slate-600 text-sm">Suggested Retail Price</span>
                                <span className="font-bold text-lg text-amber-600">${result.salePrice.toLocaleString('en-US')}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                 <span className="text-slate-500">Estimated Profit</span>
                                 <span className="text-green-600 font-medium">${profit.toLocaleString('en-US')} ({margin.toFixed(1)}%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="border-b border-slate-200 mb-4 overflow-x-auto">
                        <nav className="flex -mb-px space-x-2">
                            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
                            <TabButton active={activeTab === 'specs'} onClick={() => setActiveTab('specs')}>Specifications</TabButton>
                            <TabButton active={activeTab === 'bom'} onClick={() => setActiveTab('bom')}>Materials</TabButton>
                            <TabButton active={activeTab === 'manufacturing'} onClick={() => setActiveTab('manufacturing')}>Production</TabButton>
                            <TabButton active={activeTab === '3d'} onClick={() => setActiveTab('3d')}>3D View</TabButton>
                        </nav>
                    </div>

                    <div className="prose max-w-none text-slate-700 leading-relaxed flex-grow">
                        {activeTab === 'overview' && <p>{result.description}</p>}

                        {activeTab === 'specs' && (
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 not-prose text-sm">
                                <dt className="font-medium text-slate-500">Dimensions</dt>
                                <dd className="text-slate-800">{result.dimensions}</dd>
                                <dt className="font-medium text-slate-500">Estimated Weight</dt>
                                <dd className="text-slate-800">{result.weight}</dd>
                                <dt className="font-medium text-slate-500">Build Time</dt>
                                <dd className="text-slate-800">{result.buildTime}</dd>
                                <dt className="font-medium text-slate-500 col-span-2 mt-4">Finishing Suggestions</dt>
                                <dd className="col-span-2 prose"><ListItemParser text={result.finishing} /></dd>
                            </dl>
                        )}

                        {activeTab === 'bom' && (
                           <div className="overflow-hidden border border-slate-200 rounded-lg not-prose">
                               <table className="min-w-full divide-y divide-slate-200 text-sm">
                                   <thead className="bg-slate-50">
                                       <tr>
                                           <th className="px-4 py-2 text-left font-medium text-slate-500">Component</th>
                                           <th className="px-4 py-2 text-left font-medium text-slate-500">Material Detail</th>
                                       </tr>
                                   </thead>
                                   <tbody className="bg-white divide-y divide-slate-200">
                                       {bomItems.map((item, index) => (
                                          <tr key={index}>
                                              <td className="px-4 py-3">{item.component}</td>
                                              <td className="px-4 py-3">{item.material}</td>
                                          </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>
                        )}

                        {activeTab === 'manufacturing' && (
                           <ListItemParser text={result.manufacturing} ordered={true} />
                        )}

                        {activeTab === '3d' && (
                           <div className="not-prose">
                               <BabylonViewer result={result} />
                               <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                                   Interactive 3D model generated from the structured design data — rotate, zoom, and inspect proportions. Rendered locally with Babylon.js, no external image model required.
                               </p>
                           </div>
                        )}
                    </div>

                    <div className="mt-auto pt-6">
                         <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between gap-4 border border-slate-200">
                             <div className="flex items-center">
                                 <input
                                    id="include-costs-checkbox"
                                    type="checkbox"
                                    checked={includeCosts}
                                    onChange={(e) => setIncludeCosts(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                 />
                                 <label htmlFor="include-costs-checkbox" className="ml-3 text-sm font-medium text-slate-700">Include Cost Details</label>
                             </div>
                             <button
                                onClick={() => generatePdf(result, includeCosts)}
                                className="px-5 py-2.5 bg-slate-800 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-900 transition-colors"
                             >
                                 Download PDF
                             </button>
                         </div>
                    </div>
                </div>
            </div>

            {isImageModalOpen && (
                <ImageModal
                    imageUrl={result.imageUrl}
                    altText={result.name}
                    onClose={() => setIsImageModalOpen(false)}
                />
            )}
        </>
    );
};

export default DesignResult;
