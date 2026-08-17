import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="w-full bg-ocean-bg grid-bg py-16 px-4 font-mono min-h-screen">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="border border-ocean-mauve/40 bg-ocean-surface p-8 md:p-12 shadow-[0_0_30px_rgba(162,117,142,0.15)] relative">
          <div className="absolute -top-3 left-6 bg-ocean-mauve text-ocean-bg text-xs px-3 py-0.5 font-bold uppercase tracking-wider">
            Admin Welcome Portal or Admin Home
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 border border-ocean-mauve/40 bg-ocean-mauve/10 px-3 py-1 text-xs text-ocean-peach">
              <span className="w-2 h-2 bg-ocean-peach"></span>
              Live Routing & Problem Resolution System
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-ocean-light uppercase leading-none">
              NEXT-GEN RAIL <br />
              <span className="text-ocean-peach underline decoration-ocean-mauve decoration-4">COMMAND CONTROL</span>
            </h1>

            <p className="text-ocean-soft text-sm md:text-base max-w-2xl leading-relaxed">
              Aegis-Rail provides real-time spatial train tracking, predictive delay modeling, station platform allocation, and automated AI conflict mitigation for railway dispatchers.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/dashboard"
                className="bg-ocean-mauve hover:bg-ocean-mauve/80 text-ocean-bg font-extrabold px-6 py-3 text-sm tracking-wider uppercase border border-ocean-peach transition-all shadow-[0_0_15px_rgba(162,117,142,0.4)]"
              >
                LAUNCH Main Network Map or Live Overview →
              </Link>
              <Link
                href="/stations"
                className="bg-ocean-dark hover:bg-ocean-hover text-ocean-light font-bold px-6 py-3 text-sm tracking-wider uppercase border border-ocean-border transition-all"
              >
                STATION CONTROL HUB
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-ocean-border bg-ocean-surface p-6 space-y-3 hover:border-ocean-mauve/60 transition-colors">
            <div className="text-ocean-peach font-bold text-lg">01 MAIN NETWORK MAP</div>
            <h3 className="text-ocean-light font-bold text-base">Live Location Data</h3>
            <p className="text-ocean-soft text-xs leading-relaxed">
              Monitor active train positions, current speeds, Train Weight or Total Load, and passenger telemetry rendered via WebSockets.
            </p>
          </div>

          <div className="border border-ocean-border bg-ocean-surface p-6 space-y-3 hover:border-ocean-mauve/60 transition-colors">
            <div className="text-ocean-peach font-bold text-lg">02  STATION CONTROL</div>
            <h3 className="text-ocean-light font-bold text-base">Platform Schedules & Train Lists</h3>
            <p className="text-ocean-soft text-xs leading-relaxed">
              Real-time platform scheduling, track clearance management, and inbound/outbound arrival metrics.
            </p>
          </div>

          <div className="border border-ocean-border bg-ocean-surface p-6 space-y-3 hover:border-ocean-mauve/60 transition-colors">
            <div className="text-ocean-peach font-bold text-lg">03  Manual Alerts or Issue Management</div>
            <h3 className="text-ocean-light font-bold text-base">Delay Managementtion</h3>
            <p className="text-ocean-soft text-xs leading-relaxed">
              Automated trigger protocols for speed violations, signal holdover warnings, and manual dispatcher overrides.
            </p>
          </div>
        </div>

        {/* System Capabilities Table */}
        <div className="border border-ocean-border bg-ocean-surface p-6">
          <h3 className="text-ocean-peach font-bold text-sm tracking-widest uppercase mb-4">
            SYSTEM SPECIFICATIONS & HARDWARE INTEGRATION
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="border border-ocean-border p-3 bg-ocean-bg">
              <span className="text-ocean-medium block">TELEMETRY FREQ</span>
              <span className="text-ocean-light font-bold">1.0 Hz (1000ms)</span>
            </div>
            <div className="border border-ocean-border p-3 bg-ocean-bg">
              <span className="text-ocean-medium block">OPTIMIZER LATENCY</span>
              <span className="text-ocean-light font-bold">&lt; 45ms</span>
            </div>
            <div className="border border-ocean-border p-3 bg-ocean-bg">
              <span className="text-ocean-medium block">WEBSOCKET PROTOCOL</span>
              <span className="text-ocean-light font-bold">WSS / FASTAPI</span>
            </div>
            <div className="border border-ocean-border p-3 bg-ocean-bg">
              <span className="text-ocean-medium block">UI DESIGN SYSTEM</span>
              <span className="text-ocean-peach font-bold">OCEAN PALETTE</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}