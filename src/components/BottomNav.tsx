'use client';

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { UserProfile } from '@/lib/mockData';
import { 
  LayoutDashboard, 
  School, 
  ShieldAlert, 
  AlertTriangle,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavProps {
  user: UserProfile;
}

export const BottomNav: React.FC<BottomNavProps> = ({ user }) => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navItems = [
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
      name: t('nav.predictions'),
      href: '/dashboard/risk-predictions',
      icon: ShieldAlert,
      roles: ['school_admin', 'dept_officer']
    },
    {
      name: t('nav.interventions'),
      href: '/dashboard/interventions',
      icon: AlertTriangle,
      roles: ['school_admin', 'dept_officer']
    },
    {
      name: t('nav.reports'),
      href: '/dashboard/reports',
      icon: Download,
      roles: ['ngo_viewer'] // NGO viewers get reports in bottom nav since they don't have predictions/interventions
    }
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(user.role)).slice(0, 4);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cyber-dark/95 backdrop-blur-xl border-t border-cyber-border py-1 px-2 flex justify-around items-center">
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${
              isActive ? 'text-neon-cyan' : 'text-slate-500'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${
              isActive ? 'text-neon-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] scale-110' : 'text-slate-500'
            }`} />
            <span className="text-[10px] font-medium tracking-wide truncate max-w-[80px]">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
