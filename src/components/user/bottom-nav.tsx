'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import {
  CheckSquare,
  ShoppingBag,
  Megaphone,
  LayoutGrid,
  ChevronUp,
  User,
  DollarSign,
  Share2,
  Crown,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeUserTab,
    setActiveUserTab,
    setActiveMoreSection,
    cart,
    notifications,
    logoutUser,
  } = useEarnBull();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div ref={dropdownRef} className="fixed bottom-0 left-0 right-0 z-40">
      {/* Dropdown List Menu Popup for Phone */}
      {isDropdownOpen && (
        <div className="max-w-md mx-auto px-4 mb-2">
          <div className="bg-[#061D12]/95 backdrop-blur-xl border border-[#144930] rounded-2xl p-3 shadow-2xl space-y-1.5 animate-in slide-in-from-bottom-3 duration-200 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#144930]/60 pb-2 px-1">
              <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
                More Features & Account Options
              </span>
              <span className="text-[9px] text-emerald-300/60 font-medium">Select an option</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {moreDropdownItems.map((subItem) => {
                const SubIcon = subItem.icon;
                const isLogout = subItem.id === 'logout';
                return (
                  <button
                    key={subItem.id}
                    onClick={() => handleDropdownItemClick(subItem.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all ${
                      isLogout
                        ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                        : 'bg-[#0A2719] text-emerald-200 border border-[#144930] hover:bg-[#0C3321] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isLogout ? 'text-red-400' : 'text-emerald-400'}`} />
                      <span className="truncate text-[11px]">{subItem.label}</span>
                    </div>
                    {subItem.badge && (
                      <span className="bg-amber-400 text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0 ml-1">
                        {subItem.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Bottom Navigation Bar */}
      <nav className="bg-[#061D12]/95 backdrop-blur-md border-t border-[#144930] py-2 px-4 shadow-2xl">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeUserTab === item.id || (item.id === 'task' && activeUserTab === 'home');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-400 font-bold scale-105'
                    : 'text-emerald-200/60 hover:text-emerald-300 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-emerald-300/70'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-extrabold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] tracking-tight">{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />}
              </button>
            );
          })}

          {/* MORE BUTTON WITH DROPDOWN MENU */}
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setActiveUserTab('more');
            }}
            className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              activeUserTab === 'more' || isDropdownOpen
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-emerald-200/60 hover:text-emerald-300 font-medium'
            }`}
          >
            <div className="relative flex items-center">
              <LayoutGrid className={`w-5 h-5 ${activeUserTab === 'more' || isDropdownOpen ? 'text-emerald-400' : 'text-emerald-300/70'}`} />
              <ChevronUp className={`w-3 h-3 -mr-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            <span className="text-[11px] tracking-tight">More</span>
            {(activeUserTab === 'more' || isDropdownOpen) && <div className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />}
          </button>
        </div>
      </nav>
    </div>
  );
};
