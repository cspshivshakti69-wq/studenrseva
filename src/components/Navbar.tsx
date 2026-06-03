'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { mockDB, NotificationItem, UserProfile } from '@/lib/mockData';
import { Bell, Globe, User, LogOut, Shield, ChevronDown, Check, Menu, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  user: UserProfile;
  onLogout: () => void;
  onRoleChange?: (role: 'school_admin' | 'dept_officer' | 'ngo_viewer') => void;
  toggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onRoleChange, toggleSidebar }) => {
  const { language, toggleLanguage, t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockDB.getNotifications());
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    mockDB.markNotificationsRead();
    setNotifications(mockDB.getNotifications());
  };

  const handleRoleSelect = (role: 'school_admin' | 'dept_officer' | 'ngo_viewer') => {
    if (onRoleChange) {
      onRoleChange(role);
      setShowProfileDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full cyber-glass border-b border-cyber-border py-3 px-4 md:px-6 flex items-center justify-between">
      {/* Brand & Menu Trigger */}
      <div className="flex items-center space-x-3">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 text-slate-400 hover:text-neon-cyan focus:outline-none transition-colors"
            id="mobile-menu-toggle"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-cyan p-0.5 flex items-center justify-center shadow-glow-cyan animate-pulse">
            <span className="text-white font-extrabold text-lg">ಕ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold tracking-wider bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              {t('brand.name')}
            </span>
            <span className="text-[10px] md:text-xs text-slate-400 font-mono tracking-widest hidden md:inline">
              {t('brand.tagline')}
            </span>
          </div>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/15 hover:shadow-glow-cyan/20 hover:border-neon-cyan/50 transition-all font-semibold text-xs md:text-sm"
          id="lang-toggle-btn"
          aria-label="Toggle language"
        >
          <Globe className="w-4 h-4 animate-spin-slow" />
          <span>{t('nav.toggle_language')}</span>
        </button>

        {/* Student Portal Access */}
        <Link
          href="/student/login"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neon-teal/30 bg-neon-teal/5 text-neon-teal hover:bg-neon-teal/15 hover:border-neon-teal/50 transition-all font-semibold text-xs md:text-sm"
          aria-label="Student Portal"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden md:inline">Student</span>
        </Link>

        {/* Notifications Hub */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowProfileDropdown(false);
            }}
            className="p-2 rounded-lg border border-slate-800 bg-slate-950/80 text-slate-300 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all relative"
            id="notifications-bell"
            aria-label={t('nav.notifications')}
          >
            <Bell className="w-4 h-4 md:w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-neon-pink rounded-full ring-2 ring-background animate-pulse" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 rounded-xl border border-neon-cyan/20 bg-cyber-dark/95 backdrop-blur-xl shadow-glow-cyan/10 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-sm font-bold text-white font-mono">{t('nav.notifications')}</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-neon-cyan hover:underline flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
              <div className="mt-2 max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">No alerts.</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-lg border text-xs transition-all ${!notif.read
                        ? 'bg-neon-cyan/5 border-neon-cyan/20'
                        : 'bg-slate-950/40 border-slate-900'
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`font-semibold ${notif.type === 'danger' ? 'text-neon-pink' :
                          notif.type === 'success' ? 'text-neon-teal' : 'text-neon-cyan'
                          }`}>
                          {language === 'en' ? notif.title_en : notif.title_kn}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{notif.time}</span>
                      </div>
                      <p className="text-slate-300 mt-1">
                        {language === 'en' ? notif.desc_en : notif.desc_kn}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown & Mock Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center space-x-1.5 md:space-x-2 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs md:text-sm"
            id="profile-dropdown-trigger"
          >
            <div className="w-5 h-5 md:w-6 h-6 rounded-md bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center">
              <User className="w-3 h-3 md:w-3.5 h-3.5 text-neon-purple" />
            </div>
            <span className="font-medium hidden md:inline truncate max-w-[100px]">{user.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-64 rounded-xl border border-neon-purple/20 bg-cyber-dark/95 backdrop-blur-xl shadow-glow-purple/10 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="pb-2.5 border-b border-slate-800 mb-2">
                <span className="text-[10px] uppercase text-slate-500 font-mono tracking-widest">{t('role.logged_in_as')}</span>
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 font-mono truncate">{user.email}</p>
              </div>

              {/* Role Switcher Selection */}
              {onRoleChange && (
                <div className="space-y-1.5 mb-2.5">
                  <span className="text-[10px] uppercase text-slate-500 font-mono tracking-widest flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-neon-purple" />
                    <span>Authority Level (Mock)</span>
                  </span>
                  {(['school_admin', 'dept_officer', 'ngo_viewer'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${user.role === r
                        ? 'bg-neon-purple/15 text-neon-purple font-semibold border border-neon-purple/30'
                        : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-900/60'
                        }`}
                    >
                      <span>{t(`role.${r}`)}</span>
                      {user.role === r && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs text-neon-pink hover:bg-neon-pink/10 transition-all font-semibold border border-transparent hover:border-neon-pink/20"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
