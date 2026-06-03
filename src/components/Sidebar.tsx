'use client';

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { UserProfile } from '@/lib/mockData';
import { 
  LayoutDashboard, 
  School, 
  BarChart3, 
  AlertTriangle, 
  ShieldAlert,
  Download,
  X,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose }) => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navigationItems = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['school_admin', 'dept_officer', 'ngo_viewer']
    },
    {
      name: t('nav.schools'),
      href: '/dashboard/schools',
      icon: School,
      roles: ['school_admin', 'dept_officer', 'ngo_viewer']
    },
    {
      name: t('nav.analytics'),
      href: '/dashboard/analytics',
      icon: BarChart3,
      roles: ['dept_officer', 'ngo_viewer'] // Advanced Analytics restricted to officers & NGOs
    },
    {
      name: t('nav.predictions'),
      href: '/dashboard/risk-predictions',
      icon: ShieldAlert,
      roles: ['school_admin', 'dept_officer'] // Predictions for admins & officers
    },
    {
      name: t('nav.interventions'),
      href: '/dashboard/interventions',
      icon: AlertTriangle,
      roles: ['school_admin', 'dept_officer'] // Active intervention deployment
    },
    {
      name: t('nav.reports'),
      href: '/dashboard/reports',
      icon: Download,
      roles: ['school_admin', 'dept_officer', 'ngo_viewer']
    }
  ];

  const filteredItems = navigationItems.filter(item => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Shell */}
      <aside 
        className={`fixed md:sticky top-[69px] bottom-0 left-0 z-40 w-64 border-r border-cyber-border bg-cyber-dark/95 md:bg-cyber-dark/60 backdrop-blur-xl transition-transform duration-300 md:transform-none flex flex-col justify-between py-5 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ height: 'calc(100vh - 69px)' }}
      >
        <div className="px-4 space-y-6">
          {/* Mobile Title with Close trigger */}
          <div className="flex items-center justify-between md:hidden border-b border-slate-800 pb-3">
            <span className="text-white font-bold font-mono tracking-wider">PORTAL NAVIGATION</span>
            <button 
              onClick={onClose} 
              className="p-1 text-slate-400 hover:text-neon-pink focus:outline-none transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Summary */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-pink p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-[6px] bg-slate-950 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-neon-purple" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] font-mono text-neon-cyan truncate uppercase tracking-wider">
                {t(`role.${user.role}`).split(' ')[0]}
              </p>
            </div>
          </div>

          {/* Links Grid */}
          <nav className="space-y-1">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold border transition-all ${
                    isActive
                      ? 'bg-neon-purple/10 text-white border-neon-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                      : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-slate-900/40 hover:border-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 md:w-5 h-5 transition-transform ${
                    isActive ? 'text-neon-purple scale-110' : 'text-slate-400'
                  }`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footnote Branding */}
        <div className="px-6 py-2 border-t border-slate-950 text-[10px] text-slate-500 font-mono text-center tracking-widest uppercase">
          Version 1.2.0 • AI Core
        </div>
      </aside>
    </>
  );
};
