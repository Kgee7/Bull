'use client';

import React from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import { Megaphone, Calendar, Trophy, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PromoView: React.FC = () => {
  const { promos, setActiveUserTab } = useEarnBull();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="font-headline font-extrabold text-2xl text-white flex items-center gap-2">
          Promotions & Campaigns
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
            Special Boosts
          </span>
        </h2>
        <p className="text-xs text-emerald-300/80">Participate in limited-time partner campaigns to earn bonus commissions</p>
      </div>

      {/* Featured Campaign Banner */}
      {promos.length > 0 && (
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-[#0A2719] gold-border-glow">
          <div className="absolute inset-0">
            <img src={promos[0].bannerImage} alt={promos[0].title} className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061D12] via-[#061D12]/90 to-transparent" />
          </div>

          <div className="relative p-6 sm:p-8 max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-black">
              <Sparkles className="w-3.5 h-3.5" />
              {promos[0].rewardText}
            </span>

            <h3 className="font-headline font-extrabold text-2xl sm:text-3xl text-white">
              {promos[0].title}
            </h3>

            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
              {promos[0].description}
            </p>

            <div className="flex items-center gap-4 text-xs text-amber-300 font-semibold pt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {promos[0].startDate} - {promos[0].endDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                {promos[0].engagements.toLocaleString()} Participants
              </span>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => setActiveUserTab('task')}
                className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-amber-400/20"
              >
                Join Campaign Tasks
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="bg-[#0A2719] border border-[#144930] hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {promo.partnerName}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    promo.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {promo.status}
                </span>
              </div>

              <h4 className="font-headline font-bold text-lg text-white">{promo.title}</h4>
              <p className="text-xs text-emerald-200/80 line-clamp-2">{promo.description}</p>

              <div className="bg-[#061D12] p-3 rounded-xl border border-[#144930] flex items-center justify-between">
                <span className="text-xs text-amber-400 font-bold">{promo.rewardText}</span>
                <span className="text-[10px] text-emerald-400/80">{promo.startDate}</span>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <Button
                size="sm"
                onClick={() => setActiveUserTab('task')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs py-2 rounded-xl"
              >
                Participate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
