'use client';

import React from 'react';
import { Package, CheckSquare, Coins, ShoppingBag, ArrowRight } from 'lucide-react';

export const HowItWorksBanner: React.FC = () => {
  const steps = [
    { num: 1, icon: Package, title: 'Choose a product' },
    { num: 2, icon: CheckSquare, title: 'Complete tasks' },
    { num: 3, icon: Coins, title: 'Earn commission' },
    { num: 4, icon: ShoppingBag, title: 'Shop the same product' },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#061D12] via-[#0A2E1C] to-[#061D12] border-b border-[#144930] py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          HOW IT WORKS
        </span>

        <div className="w-full overflow-x-auto flex items-center justify-between sm:justify-center gap-2 sm:gap-6 py-1 scrollbar-none">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-emerald-200 whitespace-nowrap">
                    <strong className="text-emerald-400 font-semibold">{step.num}.</strong> {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600/60 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
