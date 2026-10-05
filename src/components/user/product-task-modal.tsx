'use client';

import React, { useState } from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ThumbsUp, UserPlus, CheckCircle, Check, ArrowRight, Wallet, AlertCircle } from 'lucide-react';

export const ProductTaskModal: React.FC = () => {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    submitTask,
    setActiveUserTab,
    setSelectedProductId,
    toggleLikeTask,
    toggleFollowTask,
  } = useEarnBull();

  const task = tasks.find((t) => t.id === selectedTaskId);

  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completedState, setCompletedState] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!task) return null;

  const isTaskLiked = task.isLiked || liked;
  const isTaskFollowed = task.isFollowed || followed;

  const handleToggleLike = () => {
    toggleLikeTask(task.id);
    setLiked(!isTaskLiked);
  };

  const handleToggleFollow = () => {
    toggleFollowTask(task.id);
    setFollowed(!isTaskFollowed);
  };

  const handleClose = () => {
    setSelectedTaskId(null);
    setLiked(false);
    setFollowed(false);
    setSelectedOption(null);
    setCompletedState(false);
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    if (!isTaskLiked || !isTaskFollowed) {
      setErrorMessage('Please like and follow the partner to complete all task steps.');
      return;
    }
    if (selectedOption === null) {
      setErrorMessage('Please select an answer to the question.');
      return;
    }

    setErrorMessage(null);
    const result = submitTask(task.id, selectedOption);

    if (result.success) {
      setCompletedState(true);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleShopSameProduct = () => {
    const pId = task.productId;
    handleClose();
    setSelectedProductId(pId);
    setActiveUserTab('shop');
  };

  return (
    <Dialog open={!!selectedTaskId} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl bg-[#061D12] border-[#144930] text-white p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {!completedState ? (
          <div>
            {/* Header */}
            <DialogHeader className="mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={task.productImage}
                  alt={task.productName}
                  className="w-16 h-16 rounded-xl object-cover border border-[#144930]"
                />
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                    {task.partnerName}
                  </span>
                  <DialogTitle className="font-headline font-bold text-xl text-white">
                    {task.productName}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-amber-400 font-bold">
                      Earn up to ${task.rewardUsd.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-semibold">
                      <ThumbsUp className="w-3 h-3 text-emerald-400" />
                      {(task.likesCount ?? 100).toLocaleString()} Likes
                    </span>
                    <span className="text-[11px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-semibold">
                      <UserPlus className="w-3 h-3 text-emerald-400" />
                      {(task.followersCount ?? 500).toLocaleString()} Followers
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Task Steps */}
            <div className="space-y-5 my-4">
              {/* Step 1: Like */}
              <div className="bg-[#0A2719] border border-[#144930] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    1. Like our partner page
                  </span>
                  {isTaskLiked && <Check className="w-4 h-4 text-emerald-400" />}
                </div>

                <div className="flex items-center justify-between gap-3 bg-[#061D12] p-3 rounded-lg border border-[#144930]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      {task.partnerName.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{task.partnerName}</h4>
                      <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 inline text-emerald-400" />
                        {(task.likesCount ?? 100).toLocaleString()} Likes
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleToggleLike}
                    className={`text-xs font-bold px-4 h-8 rounded-lg ${
                      isTaskLiked
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-black'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                    {isTaskLiked ? 'Liked' : 'Like'} ({(task.likesCount ?? 100).toLocaleString()})
                  </Button>
                </div>
              </div>

              {/* Step 2: Follow */}
              <div className="bg-[#0A2719] border border-[#144930] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    2. Follow our partner
                  </span>
                  {isTaskFollowed && <Check className="w-4 h-4 text-emerald-400" />}
                </div>

                <div className="flex items-center justify-between gap-3 bg-[#061D12] p-3 rounded-lg border border-[#144930]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                      @
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{task.partnerSocialHandle}</h4>
                      <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <UserPlus className="w-3 h-3 inline text-emerald-400" />
                        {(task.followersCount ?? 500).toLocaleString()} Followers
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleToggleFollow}
                    className={`text-xs font-bold px-4 h-8 rounded-lg ${
                      isTaskFollowed
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-black'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                    {isTaskFollowed ? 'Followed' : 'Follow'} ({(task.followersCount ?? 500).toLocaleString()})
                  </Button>
                </div>
              </div>

              {/* Step 3: Answer Question */}
              <div className="bg-[#0A2719] border border-[#144930] rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  3. Answer the question
                </span>
                <p className="text-sm font-semibold text-white">{task.question}</p>

                <div className="space-y-2 pt-1">
                  {task.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const letter = String.fromCharCode(65 + idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedOption(idx)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500 text-white font-medium'
                            : 'bg-[#061D12] border-[#144930] text-emerald-200 hover:border-emerald-500/40'
                        }`}
                      >
                        <span className="text-xs">
                          <strong className="text-emerald-400 mr-2">{letter}.</strong> {opt}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#061D12]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={handleSubmit}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Answer (${task.rewardUsd.toFixed(2)})
              </Button>

              <Button
                variant="outline"
                onClick={handleShopSameProduct}
                className="w-full border-[#144930] hover:bg-emerald-950 text-emerald-300 font-semibold text-sm py-3 rounded-xl"
              >
                Go to Bull Shop
              </Button>
            </div>
          </div>
        ) : (
          /* Task Completed Screen */
          <div className="py-6 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/30 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h2 className="font-headline font-extrabold text-2xl text-white">Congratulations!</h2>
              <p className="text-xs text-emerald-300 mt-1">You have completed all promotional tasks for this product.</p>
            </div>

            {/* Commission Box */}
            <div className="bg-gradient-to-br from-[#0C3321] to-[#0A2719] border border-amber-500/40 rounded-2xl p-5 max-w-sm mx-auto shadow-xl gold-border-glow">
              <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider block mb-1">Commission Earned</span>
              <div className="font-headline font-extrabold text-4xl text-amber-400">
                +${task.rewardUsd.toFixed(2)}
              </div>
              <p className="text-[11px] text-emerald-300/80 mt-2">
                This amount has been added directly to your available wallet balance.
              </p>
            </div>

            {/* Task Summary */}
            <div className="bg-[#0A2719] border border-[#144930] rounded-xl p-4 text-left max-w-sm mx-auto space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-200">
                <span>Like Partner</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between text-emerald-200">
                <span>Follow Partner</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between text-emerald-200">
                <span>Answer Question</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 max-w-sm mx-auto pt-2">
              <Button
                onClick={handleClose}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-500/20"
              >
                View More Products
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleClose();
                  setActiveUserTab('more');
                }}
                className="w-full border-[#144930] hover:bg-emerald-950 text-emerald-300 font-semibold text-sm py-3 rounded-xl"
              >
                View My Earnings
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
