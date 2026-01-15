import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

interface WritingCanvasProps {
  onStrokeEnd?: () => void;
  isAnalyzing: boolean;
  traceChar?: string;
  readonly?: boolean;
}

export interface WritingCanvasHandle {
  clear: () => void;
  getImageData: () => string | null;
}

const WritingCanvas = forwardRef<WritingCanvasHandle, WritingCanvasProps>(({ 
  onStrokeEnd, 
  isAnalyzing, 
  traceChar, 
  readonly = false, 
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    getImageData: () => {
      if (!canvasRef.current) return null;
      // Returns only the strokes on transparent background
      return canvasRef.current.toDataURL('image/png');
    }
  }));

  // Handle Canvas Resizing for High DPI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        const rect = parent.getBoundingClientRect();
        
        // Only resize if dimensions change to avoid clearing ink unnecessarily on mobile scroll
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          canvas.style.width = `${rect.width}px`;
          canvas.style.height = `${rect.height}px`;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.scale(dpr, dpr);
             // Reset line styles after resize
             ctx.lineCap = 'round';
             ctx.lineJoin = 'round';
             ctx.lineWidth = 12; // Pen thickness
          }
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Input Handling
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnalyzing || readonly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    
    // Ink Style
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 12; 
    ctx.strokeStyle = '#312e81'; // Indigo-900 (Deep Ink Color)
    
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isAnalyzing || readonly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    e.preventDefault(); 
    const { x, y } = getCoordinates(e, canvas);
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.closePath();
      }
      if (onStrokeEnd) onStrokeEnd();
    }
  };

  return (
    <div className="relative w-full h-full bg-[#fdfbf7] flex items-center justify-center overflow-hidden">
      
      {/* --- HTML Background Layer (Lines & Text) --- */}
      
      <div className="absolute inset-0 w-full h-full pointer-events-none flex flex-col justify-center items-center">
         {/* 1. Guide Lines (Positioned by %) */}
         {/* Ascender (Top) */}
         <div className="absolute w-full border-t border-pink-300" style={{ top: '25%' }}></div>
         {/* Mean (Middle) - Dashed */}
         <div className="absolute w-full border-t border-blue-200 border-dashed" style={{ top: '42%' }}></div>
         {/* Base (Bottom) - Solid */}
         <div className="absolute w-full border-t-2 border-blue-300" style={{ top: '59%' }}></div>
         {/* Descender (Below) */}
         <div className="absolute w-full border-t border-pink-300" style={{ top: '76%' }}></div>
      </div>

      {/* 2. The Character */}
      {/* Increased contrast for trace mode (slate-300) based on feedback */}
      <div 
        className={`relative z-10 font-cursive text-[180px] lg:text-[220px] leading-none select-none transition-colors duration-300 ${
          readonly ? 'text-slate-800' : 'text-slate-300'
        }`}
        style={{ transform: 'translateY(-2%)' }}
      >
        {traceChar}
      </div>

      {/* --- Canvas Layer (Ink) --- */}
      {!readonly && (
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 z-20 cursor-crosshair touch-none"
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
});

export default WritingCanvas;