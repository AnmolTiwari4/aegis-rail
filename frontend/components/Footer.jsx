import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-orange-500/30 py-8 px-4 font-mono rounded-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-orange-600 rounded-none"></div>
            <span className="font-bold text-white text-base tracking-wider">AEGIS-RAIL DISPATCH</span>
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed">
            High-performance real-time railway conflict prediction & dispatch engine. Exclusively for authorized railway operations officials.
          </p>
        </div>

        <div>
          <h4 className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3 border-b border-orange-500/20 pb-1">
            INTERNAL ADMIN
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-400">
            <li><Link href="/dashboard" className="hover:text-orange-500 transition-colors">God View Live Grid</Link></li>
            <li><Link href="/stations" className="hover:text-orange-500 transition-colors">Station Manifests & Gantt</Link></li>
            <li><Link href="/alerts" className="hover:text-orange-500 transition-colors">Anomaly Override Console</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3 border-b border-orange-500/20 pb-1">
            SYSTEM VERSIONING
          </h4>
          <ul className="space-y-1 text-xs text-zinc-400">
            <li>CORE_BUILD: <span className="text-white">v2.0.4-PROD</span></li>
            <li>FASTAPI_WS: <span className="text-white">ONLINE (PORT 8000)</span></li>
            <li>AI_OPTIMIZER: <span className="text-orange-500">OR-TOOLS ACTIVE</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3 border-b border-orange-500/20 pb-1">
            DISPATCH SUPPORT
          </h4>
          <p className="text-xs text-zinc-400">EMERGENCY HOTLINE: <span className="text-white font-bold">+1 (800) 555-RAIL</span></p>
          <p className="text-xs text-zinc-400 mt-1">SECURE NETWORK: <span className="text-orange-500">GRID-NET-SEC-7</span></p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-[11px] text-zinc-600">
        <span>© 2026 AEGIS-RAIL DISPATCH SYSTEMS. STRICTLY CONFIDENTIAL.</span>
        
      </div>
    </footer>
  );
}
