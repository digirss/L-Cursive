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
        <div className="flex items-center gap-6">
          <div className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-2 shadow-sm">
            <span className="text-sm font-bold tracking-tight text-indigo-600">L.EGION</span>
            <span className="text-[10px] font-medium text-indigo-400 lowercase italic">by</span>
            <span className="text-sm font-bold tracking-tight text-slate-700">1PxAi</span>
          </div>

          <nav className="hidden md:flex items-center gap-4 border-l border-slate-200 pl-6">
            <a href="/" className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">首頁</a>
            <a href="/tools" className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">工具頁</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/digirss/L-Cursive"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100"
            title="查看原程式碼與擴充功能手冊"
          >
            <div className="flex flex-col items-end mr-1 text-[10px] leading-tight text-slate-400 font-normal">
              <span>Source Code &</span>
              <span>Extension Guide</span>
            </div>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Main Content: Vertical Flex Layout */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 gap-4 flex flex-col h-[calc(100vh-64px)] overflow-hidden">

        {/* Extension Promo Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-3 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-md border border-indigo-500/30 gap-3 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-0.5">推薦推薦安裝擴充功能</h3>
            <p className="text-sm font-semibold">安裝完瀏覽器插件，就可以產生自己獨有的英文草寫習字帖。可以放到 iPad 或者電子閱讀器上手寫練習。</p>
          </div>
          <a
            href="https://github.com/digirss/L-Cursive"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white text-indigo-600 text-[11px] font-bold rounded-lg hover:bg-indigo-50 transition-all shadow-sm whitespace-nowrap"
          >
            前往 GitHub 下載插件 →
          </a>
        </div>

        {/* --- TOP SECTION: Workspace (Mirrored Layout) --- */}
        <div className="flex-[0.6] grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 max-h-[40vh]">

          {/* LEFT PANEL: Standard Model */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative group">
            {/* Header: Reduced Height (h-10) */}
            <div className="h-10 bg-slate-50 border-b border-slate-100 px-4 flex items-center justify-between shrink-0">
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

            {/* Footer: Reduced Height (h-10) */}
            <div className="h-10 bg-white border-t border-slate-100 px-4 flex items-center justify-center shrink-0">
              <p className="text-[11px] text-slate-400 font-medium">Observe the letter formation</p>
            </div>
          </div>

          {/* RIGHT PANEL: Practice Area */}
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden flex flex-col relative ring-1 ring-indigo-50">
            {/* Header: Reduced Height (h-10) - Matches Left */}
            <div className="h-10 bg-indigo-50/50 border-b border-indigo-100 px-4 flex items-center justify-between shrink-0">
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col shrink-0 h-auto max-h-[25vh]">
          <div className="bg-slate-50 border-b border-slate-100 px-5 py-2 flex justify-between items-center shrink-0">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Character</h2>

            <div className="flex bg-slate-200 p-2 rounded-2xl shadow-inner">
              <button
                onClick={() => toggleCase(true)}
                className={`px-12 py-3 text-base font-black rounded-xl transition-all ${isUppercase ? 'bg-white text-indigo-600 shadow-lg scale-110 tracking-wider' : 'text-slate-500 hover:text-slate-700'}`}
              >
                UPPER
              </button>
              <button
                onClick={() => toggleCase(false)}
                className={`px-12 py-3 text-base font-black rounded-xl transition-all ${!isUppercase ? 'bg-white text-indigo-600 shadow-lg scale-110 tracking-wider' : 'text-slate-500 hover:text-slate-700'}`}
              >
                lower
              </button>
            </div>
          </div>

          <div className="p-2 overflow-y-auto">
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1.5">
              {ALPHABET.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterSelect(letter)}
                  className={`
                      aspect-square rounded-md flex items-center justify-center text-2xl font-serif-display italic transition-all duration-200
                      ${selectedLetter === letter
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 -translate-y-0.5'
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