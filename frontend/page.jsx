import React, { useState, useEffect } from 'react';

export default function AegisDashboard() {
  const [sandboxMode, setSandboxMode] = useState(false);
  const [conflictResolved, setConflictResolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  // Simulates the Action Decay timer
  useEffect(() => {
    if (!conflictResolved && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, conflictResolved]);

  const handleApprove = () => {
    setConflictResolved(true);
  };

  return (
    <div className={`min-h-screen w-full bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row overflow-hidden ${sandboxMode ? 'ring-4 ring-blue-500/50 inset-0 absolute' : ''}`}>
      
      {/* LEFT COLUMN: The Map Canvas */}
      <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 p-8 flex items-center justify-center border-r border-slate-800/50">
        
        {/* Top bar indicating Sandbox Status */}
        <div className="absolute top-6 left-6 flex items-center space-x-4 z-10">
          <h1 className="text-2xl font-light tracking-widest text-slate-100">AEGIS<span className="font-bold text-emerald-500">RAIL</span></h1>
          {sandboxMode && (
            <span className="px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
              Sandbox Mode Active (Offline)
            </span>
          )}
        </div>

        {/* Minimalist Track Network Representation */}
        <div className="relative w-full max-w-2xl aspect-video border border-slate-800 rounded-3xl bg-slate-900/50 flex items-center justify-center overflow-hidden">
          {/* Main vertical track */}
          <div className="absolute w-1 h-full bg-slate-800 left-1/2 -translate-x-1/2"></div>
          {/* Merging track */}
          <div className="absolute w-1/2 h-1 bg-slate-800 top-1/2 -translate-y-1/2 right-1/2 origin-right -rotate-45"></div>
          
          {/* Junction Marker */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-colors duration-500 z-10 ${conflictResolved ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}></div>

          {/* Train A (Freight - Yielding) */}
          <div className={`absolute w-4 h-4 bg-amber-400 rounded-full transition-all duration-1000 ease-in-out z-20 ${conflictResolved ? 'top-1/2 right-[60%]' : 'top-[20%] left-[20%]'}`}>
             <div className="absolute top-6 -left-6 text-xs text-slate-400 whitespace-nowrap">Freight 402</div>
          </div>

          {/* Train B (Express - Priority) */}
          <div className={`absolute w-4 h-4 bg-emerald-400 rounded-full transition-all duration-1000 ease-in-out z-20 ${conflictResolved ? 'bottom-[20%] left-1/2 -translate-x-1/2' : 'bottom-1/2 left-1/2 -translate-x-1/2'}`}>
            <div className="absolute top-6 left-4 text-xs text-slate-400 whitespace-nowrap">Express 110</div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Action Panel */}
      <div className="w-full md:w-96 bg-slate-900/80 backdrop-blur-xl border-l border-white/5 p-6 flex flex-col z-20 shadow-2xl">
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
          <h2 className="text-sm uppercase tracking-widest text-slate-400">Control Panel</h2>
          
          {/* Sandbox Toggle */}
          <button 
            onClick={() => setSandboxMode(!sandboxMode)}
            className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${sandboxMode ? 'bg-blue-500' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-300 ${sandboxMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </button>
        </div>

        {!conflictResolved ? (
          // Critical Alert Card
          <div className="bg-slate-800/50 border border-red-500/20 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
              <h3 className="text-red-400 font-semibold tracking-wide">Bottleneck Predicted</h3>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              ETA clash at <span className="text-white font-medium">Itarsi Junction</span> in 32:00 mins involving Freight 402 and Express 110.
            </p>

            <div className="bg-black/20 rounded-lg p-4 mb-6 border border-white/5">
              <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">AI Recommendation</p>
              <p className="text-sm font-medium text-amber-300">Reduce Freight 402 speed to 63 km/h for priority clearance.</p>
            </div>

            {/* Action Button with Decay Timer */}
            <button 
              onClick={handleApprove}
              disabled={timeLeft === 0}
              className="w-full relative overflow-hidden bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="relative z-10 flex items-center justify-center">
                {timeLeft > 0 ? `Approve Reroute (${timeLeft}s)` : 'Action Expired'}
              </span>
              {/* Progress bar background simulating decay */}
              {timeLeft > 0 && (
                <div 
                  className="absolute top-0 left-0 h-full bg-amber-400/20 z-0 transition-all duration-1000 ease-linear" 
                  style={{ width: `${(timeLeft / 15) * 100}%` }}
                ></div>
              )}
            </button>
          </div>
        ) : (
          // Resolved State Card
          <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
             
             <div className="flex items-center space-x-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <h3 className="text-emerald-400 font-semibold tracking-wide">Network Optimized</h3>
            </div>
            
            <p className="text-slate-400 text-sm mb-6">
              Freight 402 trajectory adjusted. Junction is clear for Express 110. No complete halts required.
            </p>

            <button 
              onClick={() => {
                setConflictResolved(false);
                setTimeLeft(15);
              }}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest border-b border-slate-700 pb-1"
            >
              Reset Simulation
            </button>
          </div>
        )}

      </div>
    </div>
  );
}