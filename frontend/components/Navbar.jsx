'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'OVERVIEW' },
    { href: '/dashboard', label: 'GOD VIEW' },
    { href: '/stations', label: 'STATIONS' },
    { href: '/alerts', label: 'ALERTS CONSOLE' },
  ];

  return (
    <header className="w-full bg-black border-b border-orange-500/30 sticky top-0 z-50 rounded-none">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-orange-600 border border-orange-400 flex items-center justify-center font-bold text-black text-xl rounded-none shadow-[0_0_15px_rgba(249,115,22,0.5)]">
            A
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-white group-hover:text-orange-500 transition-colors">
              AEGIS-RAIL
            </span>
            
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 font-mono text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 border transition-all rounded-none uppercase text-xs tracking-wider ${
                  isActive
                    ? 'bg-orange-600 text-black font-bold border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-orange-500/50 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* System Status Indicator */}
        <div className="hidden md:flex items-center gap-3 border border-zinc-800 bg-zinc-950 px-3 py-1.5 rounded-none font-mono text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-none h-2.5 w-2.5 bg-orange-500"></span>
          </span>
          
          <span className="text-orange-500 font-bold">ONLINE</span>
        </div>
      </div>
    </header>
  );
}
