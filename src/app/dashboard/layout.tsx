'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { mockDB, UserProfile } from '@/lib/mockData';
import { useTranslation } from '@/context/LanguageContext';
import ChatBot from '@/components/ChatBot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useTranslation();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Authenticate user session on mount
  useEffect(() => {
    const sessionUser = localStorage.getItem('ks_current_user');
    if (!sessionUser) {
      router.push('/login');
    } else {
      try {
        const parsed = JSON.parse(sessionUser) as UserProfile;
        setUser(parsed);
        mockDB.setUserProfile(parsed);
      } catch (e) {
        localStorage.removeItem('ks_current_user');
        router.push('/login');
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ks_current_user');
    router.push('/login');
  };

  const handleRoleChange = (newRole: 'school_admin' | 'dept_officer' | 'ngo_viewer') => {
    if (!user) return;

    // Simulate updating profile role
    let name = 'Dr. Ramesh Rao';
    let district: string | undefined = 'Dakshina Kannada';

    if (newRole === 'school_admin') {
      name = 'Smt. Sumitra Devi';
      district = 'Dakshina Kannada';
    } else if (newRole === 'ngo_viewer') {
      name = 'Asha Gowda';
      district = undefined;
    }

    const updatedUser: UserProfile = {
      ...user,
      name,
      role: newRole,
      district
    };

    setUser(updatedUser);
    localStorage.setItem('ks_current_user', JSON.stringify(updatedUser));
    mockDB.setUserProfile(updatedUser);

    // Force soft refresh of dashboard layout data
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-lg border-2 border-neon-cyan border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">{t('common.loading')}</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* Visual cyber-grid background overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.05),transparent_60%)]" />

      {/* Top Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onRoleChange={handleRoleChange}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Frame: Sidebar + Main Workspace */}
      <div className="flex flex-1 relative">
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main operational workspace */}
        <main className="flex-1 overflow-x-hidden pb-20 md:pb-6 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile-Only Bottom Navigation */}
      <BottomNav user={user} />

      {/* AI Chatbot — floats over all dashboard pages */}
      <ChatBot />
    </div>
  );
}
