import { useEffect, useRef } from 'react';
import type { DesignData } from '@/types';
import { buildFurnitureScene, type BabylonHandles } from '@/services/babylon/furnitureBuilder';

interface BabylonViewerProps {
  result: DesignData;
}

const BabylonViewer: React.FC<BabylonViewerProps> = ({ result }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handlesRef = useRef<BabylonHandles | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handles = buildFurnitureScene(canvas, result);
    handlesRef.current = handles;

    const handleResize = () => handles.engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      handles.scene.dispose();
      handles.engine.dispose();
      handlesRef.current = null;
    };
  }, [result]);

  return (
    <div className="relative w-full h-[460px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
      <canvas ref={canvasRef} className="w-full h-full block outline-none touch-none" />

      <div className="absolute bottom-3 left-3 bg-white/85 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-slate-600 shadow-sm pointer-events-none">
        Drag to rotate · Scroll to zoom
      </div>

      <button
        onClick={() => handlesRef.current?.engine.resize()}
        className="absolute top-3 right-3 bg-white/85 hover:bg-white backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 shadow-sm transition-colors"
        aria-label="Reset viewport"
      >
        Fit
      </button>
    </div>
  );
};

export default BabylonViewer;
