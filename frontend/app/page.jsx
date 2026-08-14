"use client";
import React, { useState, useEffect } from 'react';

export default function AegisDashboard() {
  const [currentScenarioId, setCurrentScenarioId] = useState(1);
  const [scenarioData, setScenarioData] = useState(null);
  const [sandboxMode, setSandboxMode] = useState(false);
  
  // Simulation State
  const [countdown, setCountdown] = useState(30);
  const [actionExpired, setActionExpired] = useState(false);
  const [approved, setApproved] = useState(false);

  // Fetch real historical data from FastAPI backend (supports local or cloud environment variable)
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${API_URL}/api/v1/scenario/${currentScenarioId}`);
        if (response.ok) {
          const data = await response.json();
          setScenarioData(data);
          setCountdown(30); 
          setActionExpired(false);
          setApproved(false);
        }
      } catch (error) {
        console.error("Failed to fetch historical data from backend:", error);
      }
    };
    fetchScenario();
  }, [currentScenarioId]);

  // Handle the countdown timer logic (only ticks after data is loaded and not approved)
  useEffect(() => {
    if (scenarioData && countdown > 0 && !actionExpired && !approved) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && scenarioData && !approved) {
      setActionExpired(true);
    }
  }, [countdown, actionExpired, approved, scenarioData]);

  // Handle scenario switching (cycles 1 to 5)
  const handleNextScenario = () => {
    const nextId = currentScenarioId >= 5 ? 1 : currentScenarioId + 1;
    setCurrentScenarioId(nextId);
  };

  // Safely extract data with fallbacks while fetching
  const train1Id = scenarioData?.scenario?.train_1_id || "Loading...";
  const train2Id = scenarioData?.scenario?.train_2_id || "Loading...";
  const recommendation = scenarioData?.ai_recommendation || "Calculating optimal route...";
  const location = scenarioData?.scenario?.location || "Loading...";

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#F1ECE6] font-sans flex flex-col md:flex-row">
      
      {/* ================= LEFT SIDE: RADAR ================= */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        
        {/* Header / Brand */}
        <div className="absolute top-6 left-6 flex items-center space-x-4 z-10">
          <h1 className="text-2xl font-bold tracking-widest text-[#F1ECE6]">
            AEGIS<span className="text-[#7D4047]">RAIL</span>
          </h1>
          <div className={`px-3 py-1 text-xs rounded-full border tracking-wider ${
            sandboxMode ? 'border-[#7D4047] text-[#7D4047]' : 'border-[#DDD5CD]/30 text-[#DDD5CD]/70'
          }`}>
            {sandboxMode ? 'SANDBOX ACTIVE' : 'HISTORICAL FEED'}
          </div>
        </div>

        {/* Radar UI Viewport */}
        <div className="relative w-full max-w-2xl aspect-video border border-[#7D4047]/30 rounded-3xl bg-[#0A0A0A] overflow-hidden shadow-2xl shadow-black">
          
          {/* Radar Crosshairs */}
          <div className="absolute w-px h-full bg-[#7D4047]/20 left-1/2 -translate-x-1/2" />
          <div className="absolute w-full h-px bg-[#7D4047]/20 top-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#7D4047]/20 rounded-full" />

          {/* Train 1 Dot (Priority) */}
          <div className="absolute w-4 h-4 bg-[#F1ECE6] rounded-full top-1/3 left-1/3 shadow-[0_0_15px_#F1ECE6]">
            <div className="absolute top-6 -left-6 text-xs text-[#F1ECE6] whitespace-nowrap font-medium">
              {train1Id}
            </div>
          </div>

          {/* Train 2 Dot (Yielding/Hazard) */}
          <div className="absolute w-4 h-4 bg-[#7D4047] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_#7D4047]">
            <div className="absolute top-6 left-4 text-xs text-[#F1ECE6] whitespace-nowrap font-medium">
              {train2Id}
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: CONTROL PANEL ================= */}
      <div className="w-full md:w-96 bg-[#0A0A0A] border-l border-white/5 p-6 flex flex-col justify-center shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20">
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-[#DDD5CD]/70">Control Panel</h2>
          
          {/* Custom Sandbox Toggle Switch */}
          <button
            onClick={() => setSandboxMode(!sandboxMode)}
            className={`w-12 h-6 rounded-full relative transition-colors border border-white/10 ${sandboxMode ? 'bg-[#7D4047]' : 'bg-[#111111]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-[#F1ECE6] absolute top-1 transition-transform ${sandboxMode ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Critical Alert Box */}
        <div className="bg-[#7D4047]/10 border border-[#7D4047]/40 rounded-2xl p-5 relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#7D4047]" />
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#7D4047] animate-ping" />
            <h3 className="text-[#7D4047] font-bold text-sm tracking-wide">BOTTLENECK PREDICTED</h3>
          </div>
          <p className="text-sm text-[#DDD5CD] leading-relaxed">
            Historical ETA clash at <span className="font-bold text-[#F1ECE6]">{location}</span> involving <span className="font-bold text-[#F1ECE6]">{train1Id}</span> and <span className="font-bold text-[#F1ECE6]">{train2Id}</span>.
          </p>
        </div>

        {/* Recommendation Output */}
        <div className="bg-[#111111] rounded-lg p-4 mb-6 border border-white/5">
          <p className="text-xs uppercase tracking-wider text-[#DDD5CD]/50 mb-2">AI Recommendation</p>
          <p className="text-sm font-semibold text-[#F1ECE6] leading-relaxed">{recommendation}</p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setApproved(true)}
          disabled={actionExpired || approved || !scenarioData}
          className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all relative overflow-hidden ${
            approved
              ? 'bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 cursor-default'
              : actionExpired
              ? 'bg-[#111111] text-[#DDD5CD]/30 cursor-not-allowed border border-white/5'
              : 'bg-[#F1ECE6] text-[#050505] hover:bg-white shadow-[0_0_20px_rgba(241,236,230,0.1)]'
          }`}
        >
          {approved ? 'REROUTE APPROVED ✓' : actionExpired ? 'ACTION EXPIRED' : `APPROVE REROUTE (${countdown}s)`}
        </button>

        {/* Data Engine Cycle Button */}
        <button
          onClick={handleNextScenario}
          className="mt-4 w-full bg-[#111111] hover:bg-[#1A1A1A] text-[#DDD5CD] border border-white/5 rounded-xl py-3 text-sm font-semibold tracking-wide transition-all cursor-pointer"
        >
          Load Next Historical Scenario ({currentScenarioId}/5)
        </button>
      </div>
    </div>
  );
}