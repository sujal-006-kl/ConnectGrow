'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Sparkles, MessageSquare, Award, Compass, UserCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Compass },
    { href: '/onboarding', label: 'Create Profile', icon: Users },
    { href: '/discover', label: 'Discover 60-40 Matches', icon: Sparkles },
    { href: '/connections', label: 'Connections', icon: UserCheck },
    { href: '/chat', label: 'AI Chat', icon: MessageSquare },
    { href: '/feedback', label: 'Growth Feedback', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 group">
          <div className="w-9 h-9 rounded-xl gradient-badge flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>Connect<span className="gradient-text">Grow</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white gradient-badge shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
