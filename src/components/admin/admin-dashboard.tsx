'use client';

import React, { useState } from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import {
  Users,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Crown,
  Activity,
  Layers,
  FileText,
  Building2,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AdminDashboard: React.FC = () => {
  const { withdrawals, approveWithdrawal, rejectWithdrawal, partners, alerts, transactions } = useEarnBull();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'partners' | 'withdrawals' | 'finance'>('dashboard');

  return (
    <div className="bg-[#04120A] text-white min-h-screen p-4 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A2719] border border-[#144930] p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-amber-500/20">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline font-bold text-2xl text-white">EarnBull CP Ltd — Admin Panel</h1>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-emerald-300/80">
              Platform Command Center & Financial Administration
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {['dashboard', 'users', 'partners', 'withdrawals', 'finance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-[#061D12] text-emerald-300 border border-[#144930] hover:border-emerald-500/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0A2719] border border-[#144930] p-5 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-headline font-extrabold text-3xl text-white">125,684</div>
          <span className="text-xs text-emerald-400 font-semibold">+12.5% vs last month</span>
        </div>

        <div className="bg-[#0A2719] border border-[#144930] p-5 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Total Earnings Paid</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div className="font-headline font-extrabold text-3xl text-amber-400">$248,540.75</div>
          <span className="text-xs text-emerald-400 font-semibold">+18.7% vs last month</span>
        </div>

        <div className="bg-[#0A2719] border border-[#144930] p-5 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Platform Commission</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-headline font-extrabold text-3xl text-white">$75,430.20</div>
          <span className="text-xs text-emerald-400 font-semibold">+10.3% vs last month</span>
        </div>

        <div className="bg-[#0A2719] border border-[#144930] p-5 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Active Tasks</span>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-headline font-extrabold text-3xl text-white">1,248</div>
          <span className="text-xs text-emerald-400 font-semibold">+8.2% vs last month</span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Withdrawals & Transaction Approvals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A2719] border border-[#144930] p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                <span>Pending User Withdrawals</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {withdrawals.filter((w) => w.status === 'pending').length} Pending
                </span>
              </h3>
            </div>

            <div className="space-y-3">
              {withdrawals.map((wd) => (
                <div
                  key={wd.id}
                  className="bg-[#061D12] border border-[#144930] p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{wd.userName}</h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                          wd.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : wd.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {wd.status}
                      </span>
                    </div>
                    <p className="text-[#94A3B8] text-[11px] mt-0.5">
                      {wd.network}: <strong className="text-white">{wd.momoNumber}</strong> ({wd.accountName})
                    </p>
                    <span className="text-[10px] text-emerald-300/60">{wd.requestedAt}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right font-headline font-extrabold text-amber-400 text-sm">
                      ${wd.amountUsd.toFixed(2)}
                      <span className="text-[10px] text-emerald-300 block font-normal">
                        GH₵{wd.amountGhs.toFixed(2)}
                      </span>
                    </div>

                    {wd.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveWithdrawal(wd.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs h-8 px-3 rounded-lg"
                        >
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectWithdrawal(wd.id)}
                          className="border-red-500/40 text-red-400 hover:bg-red-950 font-bold text-xs h-8 px-3 rounded-lg"
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Partners */}
          <div className="bg-[#0A2719] border border-[#144930] p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="font-headline font-bold text-lg text-white">Top Performing Partners</h3>
            <div className="space-y-3">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#061D12] border border-[#144930] p-3.5 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">
                      {p.name.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      <span className="text-[10px] text-emerald-300/70">{p.industry} • {p.totalTasks} Tasks</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-headline font-extrabold text-emerald-400 block">
                      ${p.totalCommissionPaidUsd.toFixed(2)} Paid
                    </span>
                    <span className="text-[10px] text-emerald-300/70">{p.totalEngagements.toLocaleString()} Engagements</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Alerts & Distribution */}
        <div className="space-y-6">
          {/* Subscription Distribution */}
          <div className="bg-[#0A2719] border border-[#144930] p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="font-headline font-bold text-lg text-white">Users by Subscription Plan</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Starter ($9.99/mo)</span>
                  <span className="font-bold text-emerald-400">54.5% (68,497)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#061D12] overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[54.5%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Pro ($29.99/mo)</span>
                  <span className="font-bold text-emerald-400">30.2% (37,956)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#061D12] overflow-hidden">
                  <div className="h-full bg-amber-400 w-[30.2%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Master ($59.99/mo)</span>
                  <span className="font-bold text-emerald-400">15.3% (19,231)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#061D12] overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[15.3%]" />
                </div>
              </div>
            </div>
          </div>

          {/* System Alerts Sidebar */}
          <div className="bg-[#0A2719] border border-[#144930] p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              System Alerts
            </h3>

            <div className="space-y-3 text-xs">
              {alerts.map((alt) => (
                <div key={alt.id} className="bg-[#061D12] border border-[#144930] p-3 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-100 font-medium">{alt.message}</p>
                    <span className="text-[10px] text-emerald-400/60 block mt-1">{alt.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
