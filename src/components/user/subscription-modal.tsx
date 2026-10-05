'use client';

import React from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles, Zap, ShieldAlert } from 'lucide-react';
import type { SubscriptionLevel } from '@/lib/types';

export const SubscriptionModal: React.FC = () => {
  const { isSubscriptionModalOpen, setIsSubscriptionModalOpen, user, changeSubscription } = useEarnBull();

  const plans = [
    {
      id: 'starter' as SubscriptionLevel,
      name: 'Starter',
      price: '$9.99',
      period: '/ month',
      badge: null,
      icon: Zap,
      accent: 'border-zinc-700 bg-[#0A2719]',
      features: [
        'Access to Selected Daily Tasks',
        'Basic Commission Rates',
        'Standard Bull Shop Benefits',
        '5 Daily Task Limit',
      ],
    },
    {
      id: 'pro' as SubscriptionLevel,
      name: 'Pro',
      price: '$29.99',
      period: '/ month',
      badge: 'Popular',
      icon: Sparkles,
      accent: 'border-emerald-500/50 bg-[#0C3321] emerald-glow',
      features: [
        'Access to All Promotional Tasks',
        'Higher Task Commission (+30%)',
        'Enhanced Bull Shop Discounts',
        '10 Daily Task Limit',
        'Priority Customer Support',
      ],
    },
    {
      id: 'master' as SubscriptionLevel,
      name: 'Master',
      price: '$59.99',
      period: '/ month',
      badge: 'Exclusive',
      icon: Crown,
      accent: 'border-amber-500/60 bg-gradient-to-b from-[#143B27] to-[#0A2719] gold-border-glow',
      features: [
        'Full Eligible Task & Promo Access',
        'Highest Commission Rates (+60%)',
        'Exclusive Member Discounts',
        '20 Daily Task Limit',
        'Early Access to New Products',
        'VIP Referral Rewards',
      ],
    },
  ];

  const handleSelect = (level: SubscriptionLevel) => {
    changeSubscription(level);
    setIsSubscriptionModalOpen(false);
  };

  return (
    <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
      <DialogContent className="max-w-3xl bg-[#061D12] border-[#144930] text-white p-6 sm:p-8">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#061D12] font-bold shadow-lg shadow-amber-500/20 mb-2">
            <Crown className="w-6 h-6" />
          </div>
          <DialogTitle className="font-headline font-bold text-2xl text-white">Choose Your Level</DialogTitle>
          <DialogDescription className="text-emerald-300 text-sm">
            Subscribe to unlock the full promotional task experience and start earning maximum commissions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = user.subscriptionLevel === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${plan.accent}`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-5 h-5 ${plan.id === 'master' ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <h3 className="font-headline font-bold text-lg text-white">{plan.name}</h3>
                  </div>

                  <div className="flex items-baseline gap-1 my-3">
                    <span className="font-headline font-extrabold text-2xl text-white">{plan.price}</span>
                    <span className="text-xs text-emerald-300">{plan.period}</span>
                  </div>

                  <ul className="space-y-2 my-4">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-emerald-100">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleSelect(plan.id)}
                  disabled={isCurrent}
                  className={`w-full font-bold text-xs py-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : plan.id === 'master'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {isCurrent ? 'Current Level' : 'Subscribe Now'}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
