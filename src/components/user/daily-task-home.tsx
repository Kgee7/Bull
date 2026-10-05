'use client';

import React from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import { Trophy, ArrowRight, ShoppingBag, CheckCircle, Flame, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const DailyTaskHome: React.FC = () => {
  const { user, tasks, setSelectedTaskId, setSelectedProductId, setActiveUserTab, toggleLikeTask, toggleFollowTask } = useEarnBull();

  const progressPercent = Math.round((user.tasksCompletedToday / user.totalTasksTodayLimit) * 100);

  const handleShopNow = (productId: string) => {
    setSelectedProductId(productId);
    setActiveUserTab('shop');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Today's Progress & Balance Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Progress Card */}
        <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">Today&apos;s Progress</span>
              <h2 className="font-headline font-bold text-xl text-white">
                {user.tasksCompletedToday}/{user.totalTasksTodayLimit} <span className="text-sm font-normal text-emerald-300">Tasks Completed</span>
              </h2>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-headline font-bold text-base">
              {progressPercent}%
            </div>
          </div>
          <Progress value={progressPercent} className="h-2.5 bg-emerald-950/60" />
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#0C3321] to-[#0A2719] border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">Available Balance</span>
            <div className="font-headline font-extrabold text-3xl text-white my-1">
              ${user.availableBalanceUsd.toFixed(2)}
            </div>
            <p className="text-xs text-emerald-300/80">Total Earned: ${user.totalEarnedUsd.toFixed(2)}</p>
          </div>
          <Button
            onClick={() => setActiveUserTab('more')}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-[#061D12] font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20"
          >
            Withdraw
          </Button>
        </div>
      </div>

      {/* Products to Promote Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-bold text-xl text-white flex items-center gap-2">
            Products & Promotional Tasks
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {tasks.length} Available
            </span>
          </h2>
          <p className="text-xs text-emerald-300/80">Click task to view details, like/follow partners, and earn commission</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {tasks.map((task) => {
          const isDone = task.status === 'completed';
          const isLiked = task.isLiked;
          const isFollowed = task.isFollowed;

          return (
            <div
              key={task.id}
              onClick={() => setSelectedTaskId(task.id)}
              className="bg-[#0A2719] border border-[#144930] hover:border-emerald-500/60 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl group cursor-pointer"
            >
              <div>
                {/* Product Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#061D12] mb-3 group-hover:scale-[1.02] transition-transform">
                  <img
                    src={task.productImage}
                    alt={task.productName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-black shadow">
                    Earn ${task.rewardUsd.toFixed(2)}
                  </span>
                  {isDone && (
                    <div className="absolute inset-0 bg-[#061D12]/80 backdrop-blur-xs flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-sm">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      Completed
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1 mb-3">
                  <span className="text-[11px] font-semibold text-emerald-400/90 uppercase tracking-wider block">
                    {task.partnerName}
                  </span>
                  <h3 className="font-headline font-bold text-base text-white truncate">{task.productName}</h3>
                </div>

                {/* LIKES & FOLLOWERS DISPLAY ON CARD WHEN CLICKED / VIEWED */}
                <div className="bg-[#061D12] border border-[#144930] rounded-xl p-2 mb-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeTask(task.id);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold transition-all ${
                        isLiked
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-emerald-300/80 hover:text-emerald-300 hover:bg-[#0A2719]'
                      }`}
                    >
                      <Zap className={`w-3.5 h-3.5 ${isLiked ? 'text-emerald-400 fill-emerald-400' : 'text-emerald-400'}`} />
                      <span suppressHydrationWarning>{(task.likesCount ?? 100).toLocaleString()} Likes</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollowTask(task.id);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold transition-all ${
                        isFollowed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-emerald-300/80 hover:text-emerald-300 hover:bg-[#0A2719]'
                      }`}
                    >
                      <Flame className={`w-3.5 h-3.5 ${isFollowed ? 'text-amber-400 fill-amber-400' : 'text-amber-400'}`} />
                      <span suppressHydrationWarning>{(task.followersCount ?? 500).toLocaleString()} Followers</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Answer & Shop Now */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#144930]/80">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTaskId(task.id);
                  }}
                  disabled={isDone}
                  className={`font-bold text-xs rounded-xl py-2 shadow-sm ${
                    isDone
                      ? 'bg-zinc-800 text-zinc-500'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-black'
                  }`}
                >
                  {isDone ? 'Done' : 'Answer'}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShopNow(task.productId);
                  }}
                  className="border-[#144930] hover:bg-emerald-950 text-emerald-300 font-semibold text-xs rounded-xl py-2 flex items-center justify-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Shop Now
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekend Boost Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0A2719] to-emerald-500/10 border border-amber-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg text-white">Weekend Boost!</h3>
            <p className="text-xs text-emerald-300/90">Complete more tasks and earn extra commission rewards this weekend.</p>
          </div>
        </div>
        <Button
          onClick={() => setActiveUserTab('promo')}
          className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs px-6 py-2.5 rounded-xl shrink-0 shadow-lg shadow-amber-400/20"
        >
          Join Now
        </Button>
      </div>
    </div>
  );
};
