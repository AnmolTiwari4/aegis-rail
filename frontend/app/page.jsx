import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="w-full bg-black grid-bg py-16 px-4 font-mono">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="border border-orange-500/40 bg-zinc-950 p-8 md:p-12 shadow-[0_0_30px_rgba(249,115,22,0.15)] relative">
          <div className="absolute -top-3 left-6 bg-orange-600 text-black text-xs px-3 py-0.5 font-bold uppercase tracking-wider">
            ADMINISTRATIVE ONBOARDING GATEWAY
          </div>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
              <span className="w-2 h-2 bg-orange-500"></span>
              REAL-TIME DISPATCH & CONFLICT OPTIMIZATION ENGINE
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
              NEXT-GEN RAIL <br />
              <span className="text-orange-500 underline decoration-orange-500 decoration-4">COMMAND CONTROL</span>
            </h1>

            <p className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Aegis-Rail provides real-time spatial train tracking, predictive delay modeling, station platform allocation, and automated AI conflict mitigation for railway dispatchers.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/dashboard"
                className="bg-orange-600 hover:bg-orange-500 text-black font-extrabold px-6 py-3 text-sm tracking-wider uppercase border border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              >
                LAUNCH GOD VIEW DASHBOARD →
              </Link>
              <Link
                href="/stations"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 py-3 text-sm tracking-wider uppercase border border-zinc-700 transition-all"
              >
                STATION CONTROL HUB
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-zinc-800 bg-zinc-950 p-6 space-y-3 hover:border-orange-500/50 transition-colors">
            <div className="text-orange-500 font-bold text-lg">01 // LIVE GOD VIEW</div>
            <h3 className="text-white font-bold text-base">Spatial Telemetry Stream</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Monitor active train positions, current speeds, tonnage, and passenger telemetry rendered via WebSockets.
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-6 space-y-3 hover:border-orange-500/50 transition-colors">
            <div className="text-orange-500 font-bold text-lg">02 // STATION CONTROL</div>
            <h3 className="text-white font-bold text-base">Gantt & Manifest Allocation</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Real-time platform scheduling, track clearance management, and inbound/outbound arrival metrics.
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-6 space-y-3 hover:border-orange-500/50 transition-colors">
            <div className="text-orange-500 font-bold text-lg">03 // ANOMALY OVERRIDE</div>
            <h3 className="text-white font-bold text-base">Disruption Mitigation</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Automated trigger protocols for speed violations, signal holdover warnings, and manual dispatcher overrides.
            </p>
          </div>
        </div>

        {/* System Capabilities Table */}
        <div className="border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4">
            SYSTEM SPECIFICATIONS & HARDWARE INTEGRATION
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="border border-zinc-900 p-3 bg-black">
              <span className="text-zinc-500 block">TELEMETRY FREQ</span>
              <span className="text-white font-bold">1.0 Hz (1000ms)</span>
            </div>
            <div className="border border-zinc-900 p-3 bg-black">
              <span className="text-zinc-500 block">OPTIMIZER LATENCY</span>
              <span className="text-white font-bold">&lt; 45ms</span>
            </div>
            <div className="border border-zinc-900 p-3 bg-black">
              <span className="text-zinc-500 block">WEBSOCKET PROTOCOL</span>
              <span className="text-white font-bold">WSS / FASTAPI</span>
            </div>
            <div className="border border-zinc-900 p-3 bg-black">
              <span className="text-zinc-500 block">UI DESIGN SYSTEM</span>
              <span className="text-orange-500 font-bold">SHARP (rounded-none)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}