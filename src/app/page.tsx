'use client';

          import React, {useState} from 'react';
          import {EarnBullProvider, useEarnBull} from '@/context/earn-bull-context';
          import {TopHeader} from '@/components/user/top-header';
          import {HowItWorksBanner} from '@/components/user/how-it-works-banner';
          import {DailyTaskHome} from '@/components/user/daily-task-home';
          import {ProductTaskModal} from '@/components/user/product-task-modal';
          import {SubscriptionModal} from '@/components/user/subscription-modal';
          import {BullShopView} from '@/components/user/bull-shop-view';
          import {PromoView} from '@/components/user/promo-view';
          import {MoreAccountView} from '@/components/user/more-account-view';
          import {LeftSidebarNav} from '@/components/user/left-sidebar-nav';
          import {BottomNav} from '@/components/user/bottom-nav';
          import {PartnerDashboard} from '@/components/partner/partner-dashboard';
          import {AdminDashboard} from '@/components/admin/admin-dashboard';
          import {Smartphone, Building2, ShieldCheck, Laptop, Apple, Tv} from 'lucide-react';

          type DeviceMode = 'responsive' | 'ios' | 'android';

          function EarnBullAppContent() {
  const {activeRole, setActiveRole, activeUserTab} = useEarnBull();
          const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');

            return (
            <div className="min-h-screen bg-[#04120A] text-white flex flex-col font-body selection:bg-emerald-500 selection:text-black">
              {/* Floating Ecosystem & Platform Switcher Bar */}
              <div className="sticky top-0 z-50 bg-[#061D12]/95 backdrop-blur-md border-b border-[#144930] py-2 px-4 shadow-xl">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  {/* Brand Badge */}
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-headline font-bold text-white tracking-wide">
                      EarnBull CP Ltd Multi-Platform
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      Android • iOS • Laptop Panel
                    </span>
                  </div>

                  {/* Device & Role Controls */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {/* Device Preview Toggle (for Laptop testing) */}
                    <div className="bg-[#0A2719] border border-[#144930] p-1 rounded-xl flex items-center gap-1">
                      <button
                        onClick={() => setDeviceMode('responsive')}
                        title="Full Desktop/Laptop Screen"
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${deviceMode === 'responsive'
                            ? 'bg-emerald-500 text-black shadow'
                            : 'text-emerald-300/70 hover:text-white'
                          }`}
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Laptop Panel</span>
                      </button>

                      <button
                        onClick={() => setDeviceMode('ios')}
                        title="iOS iPhone Screen"
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${deviceMode === 'ios'
                            ? 'bg-emerald-500 text-black shadow'
                            : 'text-emerald-300/70 hover:text-white'
                          }`}
                      >
                        <Apple className="w-3.5 h-3.5" />
                        <span>iOS</span>
                      </button>

                      <button
                        onClick={() => setDeviceMode('android')}
                        title="Android Mobile Screen"
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${deviceMode === 'android'
                            ? 'bg-emerald-500 text-black shadow'
                            : 'text-emerald-300/70 hover:text-white'
                          }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Android</span>
                      </button>
                    </div>

                    <div className="h-4 w-[1px] bg-[#144930] hidden sm:block" />

                    {/* Role Selector */}
                    <div className="bg-[#0A2719] border border-[#144930] p-1 rounded-xl flex items-center gap-1">
                      <button
                        onClick={() => setActiveRole('user')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${activeRole === 'user'
                            ? 'bg-emerald-500 text-black shadow'
                            : 'text-emerald-300/70 hover:text-white'
                          }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>User App</span>
                      </button>

                      <button
                        onClick={() => setActiveRole('partner')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${activeRole === 'partner'
                            ? 'bg-emerald-500 text-black shadow'
                            : 'text-emerald-300/70 hover:text-white'
                          }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Partner</span>
                      </button>

                      <button
                        onClick={() => setActiveRole('admin')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${activeRole === 'admin'
                            ? 'bg-amber-400 text-black shadow'
                            : 'text-emerald-300/70 hover:text-white'
                          }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex justify-center py-0">
                {deviceMode === 'responsive' ? (
                  /* Full Laptop (Vertical Left Panel) & Mobile Responsive Layout */
                  <div className="w-full flex flex-1 min-h-screen">
                    {activeRole === 'user' && (
                      <div className="flex-1 flex w-full">
                        {/* Laptop Vertical Left Side Panel */}
                        <div className="hidden md:flex">
                          <LeftSidebarNav />
                        </div>

                        {/* Right Main Content Area */}
                        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
                          <TopHeader />
                          <HowItWorksBanner />

                          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                            {(activeUserTab === 'task' || activeUserTab === 'home') && <DailyTaskHome />}
                            {activeUserTab === 'shop' && <BullShopView />}
                            {activeUserTab === 'promo' && <PromoView />}
                            {activeUserTab === 'more' && <MoreAccountView />}
                          </main>

                          <ProductTaskModal />
                          <SubscriptionModal />

                          {/* Phone Horizontal Bottom Bar */}
                          <div className="block md:hidden">
                            <BottomNav />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeRole === 'partner' && <PartnerDashboard />}
                    {activeRole === 'admin' && <AdminDashboard />}
                  </div>
                ) : (
                  /* Mobile Device Frame Container (iOS / Android Simulator) */
                  <div className="my-2 sm:my-6 transition-all duration-300">
                    <div
                      className={`relative rounded-[45px] border-[10px] border-[#133824] bg-[#061D12] shadow-2xl overflow-hidden flex flex-col ${deviceMode === 'ios' ? 'w-[390px] h-[820px]' : 'w-[412px] h-[840px]'
                        }`}
                    >
                      {/* Device Status Notch Header */}
                      <div className="bg-[#061D12] text-white px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold border-b border-[#144930]/40 shrink-0">
                        <span>9:41</span>
                        {deviceMode === 'ios' ? (
                          <div className="w-24 h-4 bg-black rounded-full mx-auto border border-zinc-800" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-400" />
                        )}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] uppercase font-semibold text-emerald-400">
                            {deviceMode === 'ios' ? 'iOS 18' : '5G'}
                          </span>
                          <div className="w-4 h-2.5 rounded-xs border border-white p-0.5 flex items-center">
                            <div className="w-full h-full bg-emerald-400" />
                          </div>
                        </div>
                      </div>

                      {/* Mobile Device Scrollable Canvas */}
                      <div className="flex-1 overflow-y-auto relative flex flex-col">
                        {activeRole === 'user' && (
                          <div className="flex-1 flex flex-col pb-16">
                            <TopHeader />
                            <HowItWorksBanner />

                            <main className="flex-1 p-3">
                              {(activeUserTab === 'task' || activeUserTab === 'home') && <DailyTaskHome />}
                              {activeUserTab === 'shop' && <BullShopView />}
                              {activeUserTab === 'promo' && <PromoView />}
                              {activeUserTab === 'more' && <MoreAccountView />}
                            </main>

                            <ProductTaskModal />
                            <SubscriptionModal />
                            <BottomNav />
                          </div>
                        )}

                        {activeRole === 'partner' && <PartnerDashboard />}
                        {activeRole === 'admin' && <AdminDashboard />}
                      </div>

                      {/* iOS Home Bar Indicator */}
                      {deviceMode === 'ios' && (
                        <div className="bg-[#061D12] py-2 flex justify-center border-t border-[#144930]/30 shrink-0">
                          <div className="w-32 h-1 bg-white/40 rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            );
}

            export default function Page() {
  return (
            <EarnBullProvider>
              <EarnBullAppContent />
            </EarnBullProvider>
            );
}
