'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import {
  CheckSquare,
  ShoppingBag,
  Megaphone,
  LayoutGrid,
  ChevronRight,
  User,
  DollarSign,
  Share2,
  Crown,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Wallet,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LeftSidebarNav: React.FC = () => {
  const {
    activeUserTab,
    setActiveUserTab,
    setActiveMoreSection,
    cart,
    user,
    notifications,
    setIsSubscriptionModalOpen,
    logoutUser,
  } = useEarnBull();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'task', label: 'Task', icon: CheckSquare },
    { id: 'shop', label: 'Bull Shop', icon: ShoppingBag, badge: cart.length > 0 ? cart.length : null },
    { id: 'promo', label: 'Promo', icon: Megaphone },
  ];

  const moreDropdownItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'earnings', label: 'My Earnings & Withdraw', icon: DollarSign },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'tasks', label: 'Task Activity', icon: CheckSquare },
    { id: 'referrals', label: 'My Referrals', icon: Share2 },
    { id: 'subscription', label: 'Subscription Tiers', icon: Crown },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: (notifications || []).filter((n) => !n.read).length
        ? (notifications || []).filter((n) => !n.read).length
        : null,
    },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  const handleNavClick = (id: string) => {
    setIsDropdownOpen(false);
    setActiveUserTab(id as any);
  };

  const handleDropdownItemClick = (sectionId: string) => {
    setIsDropdownOpen(false);
    if (sectionId === 'logout') {
      logoutUser();
      return;
    }
    setActiveUserTab('more');
    setActiveMoreSection(sectionId);
  };

  return (
    <aside className="w-64 bg-[#061D12] border-r border-[#144930] flex flex-col justify-between p-4 shrink-0 shadow-2xl relative z-30">
      {/* Top Brand & Navigation Section */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#144930]/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-emerald-400">
              <path d="M12 2C8.5 2 5.5 4.5 5 8c0 3.5 2 6 4 8v3h6v-3c2-2 4-4.5 4-8 0-3.5-3.5-6-7-6zm-3 15v1h6v-1H9zm.5-9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-headline font-bold text-base text-white tracking-wide">EarnBull</h2>
              <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                CP Ltd
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/80 font-medium">Laptop Side Panel</p>
          </div>
        </div>

        {/* Main Navigation List */}
        <nav className="space-y-1.5">
          <span className="text-[10px] uppercase font-extrabold text-emerald-400/70 tracking-wider px-3 block mb-2">
            Navigation Menu
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeUserTab === item.id || (item.id === 'task' && activeUserTab === 'home');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-emerald-200/80 hover:bg-[#0A2719] hover:text-white border border-transparent hover:border-[#144930]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold flex items-center justify-center shadow">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* MORE BUTTON WITH DROPDOWN LIST */}
          <div className="relative pt-1" ref={dropdownRef}>
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setActiveUserTab('more');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeUserTab === 'more' || isDropdownOpen
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-emerald-200/80 hover:bg-[#0A2719] hover:text-white border border-transparent hover:border-[#144930]'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className={`w-4 h-4 ${activeUserTab === 'more' || isDropdownOpen ? 'text-black' : 'text-emerald-400'}`} />
                <span>More</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180 text-black' : 'text-emerald-400'}`} />
            </button>

            {/* Dropdown List Menu */}
            {isDropdownOpen && (
              <div className="mt-2 w-full bg-[#0A2719] border border-[#144930] rounded-2xl p-2 shadow-2xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto">
                <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider px-2 py-1 block border-b border-[#144930]/60">
                  Select Feature / Section
                </span>
                {moreDropdownItems.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isLogout = subItem.id === 'logout';
                  return (
                    <button
                      key={subItem.id}
                      onClick={() => handleDropdownItemClick(subItem.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isLogout
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-emerald-200/90 hover:bg-[#061D12] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <SubIcon className={`w-3.5 h-3.5 ${isLogout ? 'text-red-400' : 'text-emerald-400'}`} />
                        <span>{subItem.label}</span>
                      </div>
                      {subItem.badge && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                          {subItem.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Bottom Profile & Balance Card */}
      <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/50"
          />
          <div className="overflow-hidden">
            <h4 className="font-bold text-xs text-white truncate">{user.displayName}</h4>
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
              {user.subscriptionLevel} Tier
            </span>
          </div>
        </div>

        <div className="bg-[#061D12] border border-[#144930] p-2 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[9px] uppercase font-bold text-emerald-400 block">Balance</span>
            <span className="font-headline font-bold text-white">${user.availableBalanceUsd.toFixed(2)}</span>
          </div>
          <Button
            size="sm"
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-[10px] h-7 px-2.5 rounded-lg shadow"
          >
            Upgrade
          </Button>
        </div>
      </div>
    </aside>
  );
};
