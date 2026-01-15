import React, { useState, useRef } from 'react';
import WritingCanvas, { WritingCanvasHandle } from './components/WritingCanvas';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function App() {
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [isUppercase, setIsUppercase] = useState(true);

  // Ref for the interactive canvas (right side)
  const canvasRef = useRef<WritingCanvasHandle>(null);

  // Derived state
  const currentDisplayChar = isUppercase ? selectedLetter : selectedLetter.toLowerCase();

  const handleClear = () => {
    canvasRef.current?.clear();
  };

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    canvasRef.current?.clear();
  };

  const toggleCase = (upper: boolean) => {
    setIsUppercase(upper);
    canvasRef.current?.clear();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans-body text-slate-800 bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-30 shrink-0">
        <div className="flex items-center">
          <div className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-2 shadow-sm">
            <span className="text-sm font-bold tracking-tight text-indigo-600">L.EGION</span>
            <span className="text-[10px] font-medium text-indigo-400 lowercase italic">by</span>
            <span className="text-sm font-bold tracking-tight text-slate-700">1PxAi</span>
          </div>
        </div>
      </header>

      {/* Main Content: Vertical Flex Layout */}
      <main className="flex-1 max-w-[1800px] mx-auto w-full p-6 gap-6 flex flex-col h-[calc(100vh-64px)] overflow-hidden">

        {/* --- TOP SECTION: Workspace (Mirrored Layout) --- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">

          {/* LEFT PANEL: Standard Model */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative group">
            {/* Header: Fixed Height (h-14) */}
            <div className="h-14 bg-slate-50 border-b border-slate-100 px-5 flex items-center justify-between shrink-0">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                Standard Model
              </h2>
              <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">READ ONLY</span>
            </div>

            {/* Body: Flex-1 (Identical height to right side) */}
            <div className="flex-1 w-full relative bg-[#fdfbf7]">
              <WritingCanvas
                isAnalyzing={false}
                traceChar={currentDisplayChar}
                readonly={true}
              />
            </div>

            {/* Footer: Fixed Height (h-16) */}
            <div className="h-16 bg-white border-t border-slate-100 px-5 flex items-center justify-center shrink-0">
              <p className="text-sm text-slate-500 font-medium">Observe the letter formation</p>
            </div>
          </div>

          {/* RIGHT PANEL: Practice Area */}
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden flex flex-col relative ring-1 ring-indigo-50">
            {/* Header: Fixed Height (h-14) - Matches Left */}
            <div className="h-14 bg-slate-50 border-b border-slate-100 px-5 flex items-center justify-between shrink-0">
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Practice Canvas
              </h2>
              <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">INTERACTIVE</span>
            </div>

            {/* Body: Flex-1 (Identical height to left side) */}
            <div className="flex-1 relative bg-[#fdfbf7] cursor-crosshair touch-none">
              <WritingCanvas
                ref={canvasRef}
                isAnalyzing={false}
                traceChar={currentDisplayChar}
                readonly={false}
              />
            </div>

            {/* Footer: Fixed Height (h-16) - Matches Left */}
            <div className="h-16 bg-white border-t border-slate-100 px-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="hidden sm:inline">Trace the gray letter above</span>
              </div>

              <button
                onClick={handleClear}
                className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
              >
                <svg className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                Clear
              </button>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION: Selection Controls --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col shrink-0 h-auto max-h-[30vh]">
          <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex justify-between items-center shrink-0">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Character</h2>

            <div className="flex bg-slate-200 p-1 rounded-lg">
              <button
                onClick={() => toggleCase(true)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${isUppercase ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                UPPER
              </button>
              <button
                onClick={() => toggleCase(false)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!isUppercase ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                lower
              </button>
            </div>
          </div>

          <div className="p-5 overflow-y-auto">
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-3">
              {ALPHABET.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterSelect(letter)}
                  className={`
                      aspect-square rounded-xl flex items-center justify-center text-2xl font-serif-display italic transition-all duration-200
                      ${selectedLetter === letter
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 -translate-y-1'
                      : 'bg-slate-50 text-slate-600 hover:bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md'}
                    `}
                >
                  {isUppercase ? letter : letter.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}