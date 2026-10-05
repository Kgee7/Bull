'use client';

import React, { useState } from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import {
  LayoutDashboard,
  CheckSquare,
  Megaphone,
  ShoppingBag,
  TrendingUp,
  Plus,
  Users,
  DollarSign,
  PieChart,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ProductCategory } from '@/lib/types';

export const PartnerDashboard: React.FC = () => {
  const { partners, selectedPartnerId, setSelectedPartnerId, addPartnerProductAndTask, tasks, products, orders } = useEarnBull();

  const currentPartner = partners.find((p) => p.id === selectedPartnerId) || partners[0];

  const partnerTasks = tasks.filter((t) => t.partnerId === currentPartner.id);
  const partnerProducts = products.filter((p) => p.partnerId === currentPartner.id);
  const partnerOrders = orders.filter((o) => o.items.some((i) => i.product.partnerId === currentPartner.id));

  // Modal State for New Task & Product Creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [priceGhs, setPriceGhs] = useState('500');
  const [rewardUsd, setRewardUsd] = useState('1.00');
  const [category, setCategory] = useState<ProductCategory>('fashion');
  const [prodImg, setProdImg] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState('0');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !quizQuestion || !optA || !optB) return;

    addPartnerProductAndTask(
      {
        partnerId: currentPartner.id,
        partnerName: currentPartner.name,
        name: prodName,
        description: prodDesc || 'High quality partner product available on Bull Shop.',
        priceGhs: parseFloat(priceGhs) || 100,
        rewardUsd: parseFloat(rewardUsd) || 1.0,
        category,
        image: prodImg,
        stock: 50,
        sku: `SKU-${Date.now()}`,
        rating: 5.0,
        reviewCount: 1,
        hasTask: true,
      },
      {
        partnerId: currentPartner.id,
        partnerName: currentPartner.name,
        productName: prodName,
        productImage: prodImg,
        rewardUsd: parseFloat(rewardUsd) || 1.0,
        likePartnerUrl: 'https://facebook.com',
        followPartnerUrl: 'https://instagram.com',
        partnerSocialHandle: `@${currentPartner.name.toLowerCase().replace(/\s+/g, '')}`,
        question: quizQuestion,
        options: [optA, optB, optC || 'Option C', optD || 'Option D'],
        correctAnswerIndex: parseInt(correctIdx, 10),
        totalCompleted: 0,
        engagements: 0,
        status: 'active',
      }
    );

    setIsModalOpen(false);
    setProdName('');
    setQuizQuestion('');
    setOptA('');
    setOptB('');
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen p-4 sm:p-8 space-y-6">
      {/* Top Header & Partner Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline font-bold text-2xl text-slate-900">
              Welcome back, {currentPartner.name}! 👋
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Partner Panel
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your campaigns, track engagement performance and grow with EarnBull CP Ltd.
          </p>
        </div>

        {/* Company Switcher */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600">Active Brand:</label>
          <select
            value={selectedPartnerId}
            onChange={(e) => setSelectedPartnerId(e.target.value)}
            className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500"
          >
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.industry})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Tasks Created</span>
          <div className="font-headline font-extrabold text-3xl text-slate-900">{currentPartner.totalTasks}</div>
          <span className="text-xs text-emerald-600 font-semibold">+10.3% vs last week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Engagements</span>
          <div className="font-headline font-extrabold text-3xl text-slate-900">
            {currentPartner.totalEngagements.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-600 font-semibold">+15.6% vs last week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Commission Paid</span>
          <div className="font-headline font-extrabold text-3xl text-slate-900">
            ${currentPartner.totalCommissionPaidUsd.toFixed(2)}
          </div>
          <span className="text-xs text-emerald-600 font-semibold">+12.4% vs last week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Bull Shop Sales</span>
          <div className="font-headline font-extrabold text-3xl text-slate-900">
            GH₵{currentPartner.totalSalesGhs.toFixed(2)}
          </div>
          <span className="text-xs text-emerald-600 font-semibold">+8.7% vs last week</span>
        </div>
      </div>

      {/* Boost Brand Callout */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Campaign Creator
          </span>
          <h2 className="font-headline font-extrabold text-2xl sm:text-3xl">Boost Your Brand with EarnBull</h2>
          <p className="text-xs sm:text-sm text-emerald-200/90">
            Create promotional tasks and add products to Bull Shop to reach thousands of active users.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl shrink-0 shadow-lg shadow-emerald-400/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Task
        </Button>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks & Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Promotional Tasks */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-lg text-slate-900 flex items-center justify-between">
              <span>Active Promotional Tasks ({partnerTasks.length})</span>
              <span className="text-xs text-emerald-600 font-bold">Synchronized to App</span>
            </h3>

            <div className="space-y-3">
              {partnerTasks.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={t.productImage} alt={t.productName} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{t.productName}</h4>
                      <p className="text-xs text-slate-500">{t.question}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-headline font-extrabold text-emerald-600 text-sm block">
                      ${t.rewardUsd.toFixed(2)} Reward
                    </span>
                    <span className="text-[11px] text-slate-500">{t.totalCompleted} Engagements</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Products in Bull Shop */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-lg text-slate-900">
              Bull Shop Products ({partnerProducts.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {partnerProducts.map((p) => (
                <div key={p.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                    <span className="font-extrabold text-sm text-slate-900 block mt-0.5">
                      GH₵{p.priceGhs.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">Stock: {p.stock} units</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Recent Orders & Top Performers */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-lg text-slate-900">Top Performing Tasks</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="font-semibold">1. Like Partner Page</span>
                <span className="font-extrabold text-emerald-600">2,542 Hits</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="font-semibold">2. Follow Social Account</span>
                <span className="font-extrabold text-emerald-600">1,987 Hits</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="font-semibold">3. Answer Product Quiz</span>
                <span className="font-extrabold text-emerald-600">1,683 Hits</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-lg text-slate-900">Recent Bull Shop Orders</h3>
            <div className="space-y-2 text-xs">
              {partnerOrders.map((ord) => (
                <div key={ord.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold block text-slate-900">{ord.id}</span>
                    <span className="text-[10px] text-slate-500">{ord.userName}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">GH₵{ord.totalGhs.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create New Task & Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl bg-white text-slate-900 p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-headline font-bold text-xl text-slate-900">
              Create Promotional Task & Product
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="space-y-4 text-xs mt-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Product Name</label>
              <Input
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="e.g. Nike Air Jordan 1"
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Price (GH₵)</label>
                <Input
                  type="number"
                  value={priceGhs}
                  onChange={(e) => setPriceGhs(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Reward ($ USD)</label>
                <Input
                  type="number"
                  step="0.10"
                  value={rewardUsd}
                  onChange={(e) => setRewardUsd(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Product Image URL</label>
              <Input
                value={prodImg}
                onChange={(e) => setProdImg(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Promotional Quiz Question</label>
              <Input
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                placeholder="e.g. What technology is used in the sole?"
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Option A</label>
                <Input value={optA} onChange={(e) => setOptA(e.target.value)} className="text-xs" required />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Option B</label>
                <Input value={optB} onChange={(e) => setOptB(e.target.value)} className="text-xs" required />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Option C</label>
                <Input value={optC} onChange={(e) => setOptC(e.target.value)} className="text-xs" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Option D</label>
                <Input value={optD} onChange={(e) => setOptD(e.target.value)} className="text-xs" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Correct Answer</label>
              <select
                value={correctIdx}
                onChange={(e) => setCorrectIdx(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold"
              >
                <option value="0">Option A</option>
                <option value="1">Option B</option>
                <option value="2">Option C</option>
                <option value="3">Option D</option>
              </select>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl">
              Publish Product & Task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
