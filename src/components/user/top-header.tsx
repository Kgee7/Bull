'use client';

import React from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import { ShieldCheck, Wallet, ArrowUpRight, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopHeader: React.FC = () => {
  const { user, setIsSubscriptionModalOpen, setActiveUserTab } = useEarnBull();

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'master':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/40">
            <Crown className="w-3 h-3 text-amber-400" />
            Master Level
          </span>
        );
      case 'pro':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Pro Level
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            Starter Level
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#061D12]/95 backdrop-blur-md border-b border-[#144930] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Slogan */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 border border-emerald-500/30 text-emerald-400 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-emerald-400">
              <path d="M12 2C8.5 2 5.5 4.5 5 8c0 3.5 2 6 4 8v3h6v-3c2-2 4-4.5 4-8 0-3.5-3.5-6-7-6zm-3 15v1h6v-1H9zm.5-9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline font-bold text-lg text-white tracking-tight">EarnBull</h1>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                CP Ltd
              </span>
            </div>
            <p className="text-xs text-emerald-400/90 font-medium tracking-wide">Promote. Engage. Earn.</p>
          </div>
        </div>

        {/* User Balance & Level Badge */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* User Avatar + Level */}
          <div 
            onClick={() => setIsSubscriptionModalOpen(true)} 
            className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/40 group-hover:border-amber-400 transition-colors"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#061D12]" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-white">{user.displayName}</span>
              {getLevelBadge(user.subscriptionLevel)}
            </div>
          </div>

          {/* Balance Widget */}
          <div className="flex items-center gap-3 bg-[#0A2719] border border-[#144930] rounded-xl p-2 px-3 shadow-inner">
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase text-emerald-400 font-semibold tracking-wider">Your Balance</span>
              <span className="font-headline font-bold text-emerald-400 text-sm sm:text-base">
                ${user.availableBalanceUsd.toFixed(2)}
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => setActiveUserTab('more')}
              className="bg-emerald-500 hover:bg-emerald-600 text-[#061D12] font-bold text-xs px-3 h-8 rounded-lg shadow-md shadow-emerald-500/20"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
