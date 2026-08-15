"use client";
import React, { useState, useEffect } from 'react';

export default function AegisDashboard() {
  const [scenarioData, setScenarioData] = useState(null);
  const [sandboxMode, setSandboxMode] = useState(false);
  
  // Simulation State
  const [countdown, setCountdown] = useState(30);
  const [actionExpired, setActionExpired] = useState(false);
  const [approved, setApproved] = useState(false);

  // View State
  const [viewMode, setViewMode] = useState('RADAR'); 
  const [kpiData, setKpiData] = useState(null);

  // WebSocket State
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // UPDATED: Secure WebSocket to Render production backend
    const socket = new WebSocket("ws://localhost:8000/ws/stream");
    
    socket.onopen = () => {
      console.log("WebSocket Connected: Aegis-Rail Live Stream Active");
      socket.send("NEXT"); 
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setScenarioData(data);
      setCountdown(30);
      setActionExpired(false);
      setApproved(false);
    };

    setWs(socket);
    return () => socket.close();
  }, []);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        // UPDATED: Secure HTTPS REST API URL
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${API_URL}/api/v1/kpi`);
        if (response.ok) {
          setKpiData(await response.json());
        }
      } catch (error) {
        console.error("Failed to fetch KPIs:", error);
      }
      
    };
    fetchKPIs();
  }, []);

  useEffect(() => {
    if (scenarioData && countdown > 0 && !actionExpired && !approved) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && scenarioData && !approved && !actionExpired) {
      handleApprove("AUTO-EXECUTED: Safety protocol engaged");
      setActionExpired(true);
    }
  }, [countdown, actionExpired, approved, scenarioData]);

  const handleNextScenario = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setScenarioData(null); 
      ws.send("NEXT");
    }
  };

  // Safely extract data 
  const train1Id = scenarioData?.scenario?.train_1_id || "Loading...";
  const train2Id = scenarioData?.scenario?.train_2_id || "Loading...";
  const priorityTrain = scenarioData?.priority_train || train1Id; 
  const recommendation = scenarioData?.ai_recommendation || "Calculating optimal route...";
  const location = scenarioData?.scenario?.location || "Loading...";
  
  const t1Telemetry = scenarioData?.telemetry_data?.[train1Id];
  const t2Telemetry = scenarioData?.telemetry_data?.[train2Id];

  const handleApprove = async (actionType = "Controller Overridden & Approved") => {
    setApproved(true);
    try {
      // UPDATED: Secure HTTPS REST API URL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aegis-rail.onrender.com";
      await fetch(`${API_URL}/api/v1/audit/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: scenarioData?.scenario?.scenario_id || 0,
          priority_train_id: priorityTrain,
          action_taken: actionType 
        })
      });
    } catch (error) {
      console.error("Failed to save audit log", error);
    }
  };

  // --- DYNAMIC KINEMATIC POSITIONS ---
  // Calculates exactly where the trains should be on the SVG track
  let t1X = -150; // Default offscreen
  let t1Y = 0;
  let t2X = 1050; // Default offscreen
  let t2Y = 0;

  if (scenarioData) {
    if (approved) {
      // Accelerate to resolved routes
      t1X = priorityTrain === train1Id ? 1100 : 350;
      t1Y = priorityTrain === train1Id ? 0 : -115;
      
      t2X = priorityTrain === train2Id ? -200 : 550;
      t2Y = priorityTrain === train2Id ? 0 : -115;
    } else {
      // Creep towards the bottleneck center while timer ticks down
      t1X = 0 + (30 - countdown) * 4;
      t2X = 900 - (30 - countdown) * 4;
    }
  }

  // Linear smooth movement for creeping, ease-in-out for rapid acceleration
  const movementTransition = approved 
    ? 'transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)' 
    : 'transform 1s linear';

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#F1ECE6] font-sans flex flex-col md:flex-row">
      
      {/* ================= LEFT SIDE: RAILWAY MIMIC PANEL & KPIs ================= */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        
        <div className="absolute top-6 left-6 flex items-center space-x-4 z-10">
          <h1 className="text-2xl font-bold tracking-widest text-[#F1ECE6]">
            AEGIS<span className="text-[#7D4047]">RAIL</span>
          </h1>
          <div className={`px-3 py-1 text-xs rounded-full border tracking-wider ${
            sandboxMode ? 'border-[#7D4047] text-[#7D4047]' : 'border-[#DDD5CD]/30 text-[#DDD5CD]/70'
          }`}>
            {sandboxMode ? 'SANDBOX ACTIVE' : 'LIVE STREAM FEED'}
          </div>
        </div>

        <div className="absolute top-6 right-6 flex items-center space-x-2 z-10">
          <button 
            onClick={() => setViewMode('RADAR')}
            className={`px-4 py-2 text-xs rounded-full border tracking-wider transition-all ${viewMode === 'RADAR' ? 'bg-[#7D4047] border-[#7D4047] text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
          >
            MICRO: TRACK MIMIC
          </button>
          <button 
            onClick={() => setViewMode('KPI')}
            className={`px-4 py-2 text-xs rounded-full border tracking-wider transition-all ${viewMode === 'KPI' ? 'bg-[#7D4047] border-[#7D4047] text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
          >
            MACRO: NETWORK KPIs
          </button>
        </div>

        {/* Dynamic Viewport */}
        <div className="relative w-full max-w-3xl aspect-video border border-[#7D4047]/30 rounded-3xl bg-[#0A0A0A] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
          
          {viewMode === 'RADAR' ? (
            <svg viewBox="0 0 1000 400" className="w-full h-full drop-shadow-2xl">
              <defs>
                <pattern id="track" width="20" height="10" patternUnits="userSpaceOnUse">
                  <rect width="20" height="10" fill="none" />
                  <line x1="10" y1="-5" x2="10" y2="15" stroke="#222" strokeWidth="3" />
                </pattern>
                <linearGradient id="beamRight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F1ECE6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F1ECE6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="beamLeft" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#F1ECE6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F1ECE6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* === TRACKS === */}
              {/* Siding Track (Loop) */}
              <path d="M 250 200 C 350 80, 650 80, 750 200" fill="none" stroke="#111" strokeWidth="16" />
              <path d="M 250 200 C 350 80, 650 80, 750 200" fill="none" stroke="url(#track)" strokeWidth="16" />
              <path d="M 250 200 C 350 80, 650 80, 750 200" fill="none" stroke="#444" strokeWidth="2" />

              {/* Main Track */}
              <line x1="0" y1="200" x2="1000" y2="200" stroke="#111" strokeWidth="16" />
              <line x1="0" y1="200" x2="1000" y2="200" stroke="url(#track)" strokeWidth="16" />
              <line x1="0" y1="200" x2="1000" y2="200" stroke="#444" strokeWidth="2" />

              {/* Active Switch Indicators */}
              <circle cx="250" cy="200" r="6" fill={approved && priorityTrain !== train1Id ? "#7D4047" : "#555"} className="transition-colors duration-500" />
              <circle cx="750" cy="200" r="6" fill={approved && priorityTrain !== train2Id ? "#7D4047" : "#555"} className="transition-colors duration-500" />

              {/* === SIGNALS === */}
              {/* T1 Signal (Left Bottleneck) */}
              <rect x="220" y="215" width="16" height="32" rx="4" fill="#111" stroke="#333" />
              <circle cx="228" cy="223" r="5" fill={approved ? (priorityTrain === train1Id ? "#10b981" : "#f59e0b") : "#ef4444"} className="transition-colors duration-500 shadow-[0_0_10px_#ef4444]" />
              <circle cx="228" cy="239" r="5" fill={approved ? (priorityTrain !== train1Id ? "#10b981" : "#222") : "#222"} className="transition-colors duration-500" />

              {/* T2 Signal (Right Bottleneck) */}
              <rect x="764" y="215" width="16" height="32" rx="4" fill="#111" stroke="#333" />
              <circle cx="772" cy="223" r="5" fill={approved ? (priorityTrain === train2Id ? "#10b981" : "#f59e0b") : "#ef4444"} className="transition-colors duration-500 shadow-[0_0_10px_#ef4444]" />
              <circle cx="772" cy="239" r="5" fill={approved ? (priorityTrain !== train2Id ? "#10b981" : "#222") : "#222"} className="transition-colors duration-500" />

              {/* === TRAINS === */}
              {scenarioData && (
                <>
                  {/* Train 1 (Moving Left to Right) */}
                  <g style={{
                    transform: `translate(${t1X}px, ${t1Y}px)`,
                    transition: movementTransition
                  }}>
                    {/* Headlight Beam */}
                    <polygon points="100,195 250,150 250,250" fill="url(#beamRight)" />
                    {/* Chassis */}
                    <rect x="0" y="186" width="100" height="28" rx="4" fill="#F1ECE6" className="drop-shadow-lg" />
                    <rect x="75" y="182" width="20" height="36" rx="2" fill="#DDD5CD" />
                    <text x="45" y="175" fill="#F1ECE6" fontSize="13" fontWeight="bold" textAnchor="middle" className="tracking-widest">{train1Id}</text>
                  </g>

                  {/* Train 2 (Moving Right to Left) */}
                  <g style={{
                    transform: `translate(${t2X}px, ${t2Y}px)`,
                    transition: movementTransition
                  }}>
                    {/* Headlight Beam */}
                    <polygon points="0,195 -150,150 -150,250" fill="url(#beamLeft)" />
                    {/* Chassis */}
                    <rect x="0" y="186" width="100" height="28" rx="4" fill="#7D4047" className="drop-shadow-lg" />
                    <rect x="5" y="182" width="20" height="36" rx="2" fill="#5c2e33" />
                    <text x="55" y="235" fill="#7D4047" fontSize="13" fontWeight="bold" textAnchor="middle" className="tracking-widest">{train2Id}</text>
                  </g>
                </>
              )}
            </svg>
          ) : (
            <div className="h-full w-full flex flex-col justify-center p-12">
              <h3 className="text-xl font-bold tracking-widest text-[#F1ECE6] mb-8 text-center uppercase">Section Throughput Overview</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 text-center shadow-lg">
                  <p className="text-xs uppercase tracking-wider text-[#DDD5CD]/50 mb-2">Throughput Efficiency</p>
                  <p className="text-4xl font-bold text-emerald-400">{kpiData?.throughput_efficiency || "Loading..."}</p>
                </div>
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 text-center shadow-lg">
                  <p className="text-xs uppercase tracking-wider text-[#DDD5CD]/50 mb-2">Avg Delay Prevented</p>
                  <p className="text-4xl font-bold text-[#F1ECE6]">{kpiData?.avg_delay_prevented_mins || "..."} <span className="text-lg text-white/50">mins</span></p>
                </div>
                <div className="bg-[#111111] border border-[#7D4047]/30 rounded-2xl p-6 text-center col-span-2 shadow-lg">
                  <p className="text-xs uppercase tracking-wider text-[#7D4047] mb-2">Total Conflicts Auto-Resolved</p>
                  <p className="text-3xl font-bold text-[#7D4047]">{kpiData?.total_conflicts_resolved || "..."}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE: CONTROL PANEL ================= */}
      <div className="w-full md:w-96 bg-[#0A0A0A] border-l border-white/5 p-6 flex flex-col justify-center shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20">
        
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-[#DDD5CD]/70">Control Panel</h2>
          <button
            onClick={() => setSandboxMode(!sandboxMode)}
            className={`w-12 h-6 rounded-full relative transition-colors border border-white/10 ${sandboxMode ? 'bg-[#7D4047]' : 'bg-[#111111]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-[#F1ECE6] absolute top-1 transition-transform ${sandboxMode ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="bg-[#7D4047]/10 border border-[#7D4047]/40 rounded-2xl p-5 relative overflow-hidden mb-4">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#7D4047]" />
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#7D4047] animate-ping" />
            <h3 className="text-[#7D4047] font-bold text-sm tracking-wide">BOTTLENECK PREDICTED</h3>
          </div>
          <p className="text-sm text-[#DDD5CD] leading-relaxed">
            Historical ETA clash at <span className="font-bold text-[#F1ECE6]">{location}</span> involving <span className="font-bold text-[#F1ECE6]">{train1Id}</span> and <span className="font-bold text-[#F1ECE6]">{train2Id}</span>.
          </p>
        </div>

        <div className="bg-[#111111] rounded-lg p-4 mb-4 border border-white/5">
          <p className="text-xs uppercase tracking-wider text-[#DDD5CD]/50 mb-2">AI Recommendation</p>
          <p className="text-sm font-semibold text-[#F1ECE6] leading-relaxed">{recommendation}</p>
        </div>

        {t1Telemetry && t2Telemetry && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className={`border rounded-lg p-3 ${priorityTrain === train1Id ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-[#111111] border-white/5'}`}>
              <p className="text-[10px] uppercase tracking-wider text-[#F1ECE6] mb-1">{train1Id} Physics</p>
              <p className="text-xs text-[#DDD5CD]/70">Stop Dist: <span className="text-emerald-400 font-mono">{t1Telemetry.stopping_distance_meters}m</span></p>
              <p className="text-xs text-[#DDD5CD]/70">Momentum: <span className="text-[#DDD5CD] font-mono">{t1Telemetry.momentum_kg_ms}</span></p>
            </div>
            <div className={`border rounded-lg p-3 ${priorityTrain === train2Id ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-[#111111] border-[#7D4047]/30'}`}>
              <p className="text-[10px] uppercase tracking-wider text-[#7D4047] mb-1">{train2Id} Physics</p>
              <p className="text-xs text-[#DDD5CD]/70">Stop Dist: <span className="text-[#7D4047] font-mono">{t2Telemetry.stopping_distance_meters}m</span></p>
              <p className="text-xs text-[#DDD5CD]/70">Momentum: <span className="text-[#DDD5CD] font-mono">{t2Telemetry.momentum_kg_ms}</span></p>
            </div>
          </div>
        )}

        <button
          onClick={() => handleApprove("Controller Overridden & Approved")}
          disabled={actionExpired || approved || !scenarioData}
          className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all relative overflow-hidden ${
            approved && !actionExpired
              ? 'bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 cursor-default'
              : actionExpired
              ? 'bg-amber-600/25 text-amber-500 border border-amber-500/30 cursor-default'
              : 'bg-[#F1ECE6] text-[#050505] hover:bg-white shadow-[0_0_20px_rgba(241,236,230,0.1)]'
          }`}
        >
          {approved && !actionExpired ? 'REROUTE APPROVED ✓' : actionExpired ? 'AUTO-EXECUTED ⚠' : `APPROVE REROUTE (${countdown}s)`}
        </button>

        <button
          onClick={handleNextScenario}
          className="mt-4 w-full bg-[#111111] hover:bg-[#1A1A1A] text-[#DDD5CD] border border-white/5 rounded-xl py-3 text-sm font-semibold tracking-wide transition-all cursor-pointer"
        >
          Load Next Traffic Scenario (Live Stream)
        </button>
      </div>
    </div>
  );
}