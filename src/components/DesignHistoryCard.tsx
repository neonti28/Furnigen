import React, { useState } from 'react';
import type { DesignHistoryItem } from '@/types';
import Modal from '@/components/Modal';
import DesignResult from '@/components/DesignResult';
import ImageModal from '@/components/ImageModal';

interface DesignHistoryCardProps {
  historyItem: DesignHistoryItem;
  onReuseInputs: () => void;
}

const DesignHistoryCard: React.FC<DesignHistoryCardProps> = ({ historyItem, onReuseInputs }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { result } = historyItem;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
        <div
          className="relative h-56 overflow-hidden bg-slate-100 cursor-pointer"
          onClick={() => setIsImageModalOpen(true)}
        >
          <img
            src={result.imageUrl}
            alt={result.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
               View Image
             </div>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-slate-800 capitalize mb-1 truncate" title={result.name}>
            {result.name}
          </h3>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">
            {result.description}
          </p>

          <div className="mt-auto grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsDetailOpen(true)}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200"
            >
              Details
            </button>
            <button
              onClick={onReuseInputs}
              className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium rounded-lg transition-colors border border-amber-200"
            >
              Reuse Inputs
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Design Specification: ${result.name}`}
      >
        <DesignResult result={result} />
      </Modal>

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

export default DesignHistoryCard;
