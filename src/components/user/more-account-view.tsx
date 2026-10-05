'use client';

import React, { useState } from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import {
  User,
  Wallet,
  ShoppingBag,
  Share2,
  Crown,
  CreditCard,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  ArrowUpRight,
  CheckCircle,
  Copy,
  ChevronRight,
  Clock,
  Bell,
  FileText,
  ShieldCheck,
  CheckSquare,
  Building,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  Lock,
  Smartphone,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  Check,
  AlertCircle,
  Award,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type MoreSection =
  | 'profile'
  | 'earnings'
  | 'orders'
  | 'tasks'
  | 'referrals'
  | 'subscription'
  | 'payment'
  | 'notifications'
  | 'settings'
  | 'help'
  | 'terms'
  | 'privacy'
  | 'about'
  | 'logout';

export const MoreAccountView: React.FC = () => {
  const {
    user,
    transactions,
    orders,
    tasks,
    paymentMethods,
    notifications,
    isLoggedOut,
    setIsSubscriptionModalOpen,
    requestWithdrawal,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleNotificationPref,
    logoutUser,
    loginUser,
    resetToRealUserData,
    setActiveUserTab,
    changeSubscription,
    activeMoreSection,
  } = useEarnBull();

  const [activeSection, setActiveSection] = useState<MoreSection>('profile');

  React.useEffect(() => {
    if (activeMoreSection && (activeMoreSection as any)) {
      setActiveSection(activeMoreSection as MoreSection);
    }
  }, [activeMoreSection]);

  // Form States
  // Profile Form
  const [profileName, setProfileName] = useState(user.displayName);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phoneNumber || '+233 24 123 4567');
  const [profileAddress, setProfileAddress] = useState(user.address || '14 Independence Avenue, Ridge, Accra, Ghana');
  const [profilePhoto, setProfilePhoto] = useState(user.photoURL || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Withdrawal Form
  const [withdrawAmount, setWithdrawAmount] = useState('20');
  const [momoNumber, setMomoNumber] = useState(user.payoutDetails?.momoNumber || '0241234567');
  const [accountName, setAccountName] = useState(user.payoutDetails?.accountName || 'Robert Paul');
  const [withdrawalMessage, setWithdrawalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Payment Method Dialog
  const [isAddPmOpen, setIsAddPmOpen] = useState(false);
  const [newPmNetwork, setNewPmNetwork] = useState('MTN Mobile Money');
  const [newPmName, setNewPmName] = useState('');
  const [newPmNumber, setNewPmNumber] = useState('');
  const [newPmDefault, setNewPmDefault] = useState(true);

  // Settings
  const [currencyPref, setCurrencyPref] = useState<'USD' | 'GHS'>('USD');
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  // Help & Support Form
  const [supportCategory, setSupportCategory] = useState('Withdrawal Question');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Transactions Filter
  const [txFilter, setTxFilter] = useState<'all' | 'earned' | 'withdraw' | 'shop'>('all');

  // FAQ Search
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: profileName,
      email: profileEmail,
      phoneNumber: profilePhone,
      address: profileAddress,
      photoURL: profilePhoto,
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawalMessage({ type: 'error', text: 'Please enter a valid withdrawal amount.' });
      return;
    }

    const res = requestWithdrawal(amt, momoNumber, accountName);
    if (res.success) {
      setWithdrawalMessage({ type: 'success', text: res.message });
      setWithdrawAmount('');
    } else {
      setWithdrawalMessage({ type: 'error', text: res.message });
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPmName || !newPmNumber) return;
    addPaymentMethod({
      network: newPmNetwork,
      accountName: newPmName,
      momoNumber: newPmNumber,
      isDefault: newPmDefault,
    });
    setNewPmName('');
    setNewPmNumber('');
    setIsAddPmOpen(false);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage) return;
    setSupportSubmitted(true);
    setSupportMessage('');
    setTimeout(() => setSupportSubmitted(false), 4000);
  };

  const menuItems: { id: MoreSection; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'earnings', label: 'My Earnings', icon: DollarSign },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, badge: `${(orders || []).length}` },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'referrals', label: 'My Referrals', icon: Share2 },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: (notifications || []).filter((n) => !n.read).length ? `${(notifications || []).filter((n) => !n.read).length}` : undefined,
    },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'about', label: 'About EarnBull CP Ltd', icon: Building },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  const faqs = [
    {
      q: 'How do I earn daily cash rewards on EarnBull?',
      a: 'Navigate to the Tasks tab, complete partner promotional questions, like/follow verified partner pages, and instant commission rewards ($ USD) will be added directly to your available balance.',
    },
    {
      q: 'How fast are Mobile Money (MoMo) withdrawals processed?',
      a: 'Withdrawal requests to MTN Mobile Money, Telecel Cash, or AirtelTigo Money are processed automatically within 5 to 30 minutes (Rate: $1.00 USD = GH₵12.00 GHS).',
    },
    {
      q: 'What is the daily task limit for each subscription tier?',
      a: 'Starter tier accounts get 5 daily tasks. Pro level accounts unlock 10 daily tasks. Master level accounts get up to 20 daily tasks with priority payout settlement.',
    },
    {
      q: 'How does the Referral Commission program work?',
      a: 'Share your unique referral code. You earn lifetime commission bonuses every time your active referral completes promotional tasks or purchases products in the Bull Shop.',
    },
    {
      q: 'Can I purchase products in the Bull Shop using my earned balance?',
      a: 'Yes! You can use your GHS wallet or available balance at checkout for genuine products delivered directly across Ghana.',
    },
    {
      q: 'Is EarnBull CP Ltd legally registered in Ghana?',
      a: 'Yes, EarnBull CP Ltd is fully incorporated and licensed in Ghana with official corporate registration and verified Mobile Money payout integrations.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const filteredTx = transactions.filter((tx) => {
    if (txFilter === 'earned') return tx.type === 'task-earned' || tx.type === 'referral-bonus';
    if (txFilter === 'withdraw') return tx.type === 'withdraw';
    if (txFilter === 'shop') return tx.type === 'shop-purchase';
    return true;
  });

  if (isLoggedOut) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#0A2719] border border-[#144930] p-8 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <LogOut className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-headline font-bold text-2xl text-white">Signed Out</h2>
          <p className="text-xs text-emerald-300/70 mt-1">
            You have successfully logged out of your EarnBull CP Ltd account.
          </p>
        </div>
        <Button
          onClick={loginUser}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20"
        >
          Sign Back In as {user.displayName}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner Profile Summary Card */}
      <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/50 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#0A2719] rounded-full" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-headline font-bold text-xl text-white">{user.displayName}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  {user.subscriptionLevel} Tier
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">{user.email}</p>
              <p className="text-[11px] text-emerald-400/70 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-500 inline" />
                {user.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#061D12] border border-[#144930] p-3 rounded-xl text-right flex-1 sm:flex-initial">
              <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">Balance</span>
              <span className="font-headline font-extrabold text-lg text-white">
                ${user.availableBalanceUsd.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs px-4 py-3 rounded-xl shadow-lg shadow-amber-400/20 whitespace-nowrap"
            >
              Upgrade Tier
            </Button>
          </div>
        </div>
      </div>

      {/* 14 Features Navigation Grid / Pills */}
      <div className="bg-[#0A2719]/80 border border-[#144930] p-3 rounded-2xl">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 px-2">Account Features & Services</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`relative flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs transition-all text-left ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-[#061D12] text-emerald-200/90 hover:bg-[#0C3321] hover:text-white border border-[#144930]'
                }`}
              >
                <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-emerald-400'}`} />
                <span className="truncate text-[11px] font-semibold">{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-black text-emerald-400'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Section Content Area */}
      <div className="space-y-6">
        {/* 1. MY PROFILE */}
        {activeSection === 'profile' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  My Personal Profile
                </h3>
                <p className="text-xs text-emerald-300/80">Manage your EarnBull user information and account details.</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Verified Account
              </span>
            </div>

            {profileSavedMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Profile details updated successfully!
              </div>
            )}

            <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-1">Full Name / Display Name</label>
                <Input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="bg-[#061D12] border-[#144930] text-white text-xs rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-1">Email Address</label>
                <Input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="bg-[#061D12] border-[#144930] text-white text-xs rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-1">Phone Number</label>
                <Input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="bg-[#061D12] border-[#144930] text-white text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-1">Profile Photo URL</label>
                <Input
                  type="text"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  className="bg-[#061D12] border-[#144930] text-white text-xs rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-emerald-300 block mb-1">Residential Address (Ghana)</label>
                <Input
                  type="text"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="bg-[#061D12] border-[#144930] text-white text-xs rounded-xl"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* 2. MY EARNINGS */}
        {activeSection === 'earnings' && (
          <div className="space-y-6">
            {/* Balance Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0A2719] border border-[#144930] p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Available Balance</span>
                <div className="font-headline font-extrabold text-2xl text-white mt-1">
                  ${user.availableBalanceUsd.toFixed(2)}
                </div>
              </div>

              <div className="bg-[#0A2719] border border-[#144930] p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Pending Earnings</span>
                <div className="font-headline font-extrabold text-2xl text-amber-400 mt-1">
                  ${user.pendingEarningsUsd.toFixed(2)}
                </div>
              </div>

              <div className="bg-[#0A2719] border border-[#144930] p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Total Earned</span>
                <div className="font-headline font-extrabold text-2xl text-white mt-1">
                  ${user.totalEarnedUsd.toFixed(2)}
                </div>
              </div>

              <div className="bg-[#0A2719] border border-[#144930] p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">GHS Wallet</span>
                <div className="font-headline font-extrabold text-2xl text-white mt-1">
                  GH₵{user.ghsBalance.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Withdrawal Form */}
            <div className="bg-gradient-to-br from-[#0C3321] to-[#0A2719] border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
              <h3 className="font-headline font-bold text-lg text-white mb-2 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                Instant MoMo Withdrawal Request
              </h3>
              <p className="text-xs text-emerald-300/80 mb-4">
                Withdraw eligible earnings directly to your MTN Mobile Money account (Rate: $1.00 USD = GH₵12.00 GHS).
              </p>

              {withdrawalMessage && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
                    withdrawalMessage.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{withdrawalMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleWithdraw} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-1">Amount (USD)</label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 20"
                    className="bg-[#061D12] border-[#144930] text-white text-xs rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-1">MoMo Number</label>
                  <Input
                    type="text"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="024XXXXXXX"
                    className="bg-[#061D12] border-[#144930] text-white text-xs rounded-xl"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs py-2.5 h-9 rounded-xl shadow-lg shadow-emerald-500/20"
                  >
                    Submit Withdrawal
                  </Button>
                </div>
              </form>
            </div>

            {/* Detailed Transaction History */}
            <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="font-headline font-bold text-base text-white">Full Transaction History</h3>
                <div className="flex items-center gap-1 bg-[#061D12] border border-[#144930] p-1 rounded-xl text-[11px]">
                  {(['all', 'earned', 'withdraw', 'shop'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTxFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                        txFilter === filter ? 'bg-emerald-500 text-black shadow' : 'text-emerald-300/70 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredTx.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-[#061D12] border border-[#144930] p-3 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-white">{tx.description}</h4>
                      <span className="text-[10px] text-emerald-300/60">{tx.date}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-headline font-extrabold block ${
                          tx.type === 'withdraw' || tx.type === 'shop-purchase' ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {tx.type === 'withdraw' || tx.type === 'shop-purchase' ? '-' : '+'}
                        {tx.currency === 'USD' ? `$${tx.amount.toFixed(2)}` : `GH₵${tx.amount.toFixed(2)}`}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-emerald-400/80">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. MY ORDERS */}
        {activeSection === 'orders' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  My Bull Shop Orders
                </h3>
                <p className="text-xs text-emerald-300/80">Track delivery status and view past purchases.</p>
              </div>
              <Button
                onClick={() => setActiveUserTab('shop')}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-4 py-2 rounded-xl"
              >
                Go to Bull Shop
              </Button>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-[#061D12] border border-[#144930] rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#144930]/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-white text-sm">{ord.id}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-300/60 mt-0.5">Placed on {ord.createdAt}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Amount</span>
                      <span className="font-headline font-extrabold text-white text-base">GH₵{ord.totalGhs.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#144930]"
                          />
                          <div>
                            <p className="font-bold text-white">{item.product.name}</p>
                            <p className="text-[10px] text-emerald-300/60">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-300">GH₵{(item.product.priceGhs * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#144930]/40 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-300/70">Shipping Address: {ord.shippingAddress}</span>
                    <Button
                      size="sm"
                      onClick={() => setActiveUserTab('shop')}
                      className="bg-[#0A2719] hover:bg-[#0C3321] text-emerald-300 border border-[#144930] text-[10px] h-7 px-3 rounded-lg"
                    >
                      Re-order Items
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MY TASKS */}
        {activeSection === 'tasks' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                  My Promotional Task Activity
                </h3>
                <p className="text-xs text-emerald-300/80">Track your completed engagement tasks and daily limits.</p>
              </div>
              <Button
                onClick={() => setActiveUserTab('task')}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-4 py-2 rounded-xl"
              >
                Start Daily Tasks
              </Button>
            </div>

            {/* Task Limits Progress Card */}
            <div className="bg-[#061D12] border border-[#144930] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Today's Progress</span>
                <h4 className="font-headline font-bold text-white text-base">
                  {user.tasksCompletedToday} of {user.totalTasksTodayLimit} Tasks Completed Today
                </h4>
                <p className="text-xs text-emerald-300/70 mt-0.5">
                  Upgrade your tier to unlock up to 20 high-commission promotional tasks daily.
                </p>
              </div>

              <div className="w-full sm:w-48 bg-[#0A2719] h-3 rounded-full overflow-hidden border border-[#144930]">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(user.tasksCompletedToday / user.totalTasksTodayLimit) * 100}%` }}
                />
              </div>
            </div>

            {/* Active & Available Promotional Tasks */}
            <div className="space-y-3">
              <h4 className="font-headline font-bold text-white text-sm">Available Promotional Tasks</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-[#061D12] border border-[#144930] p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.productImage}
                          alt={task.productName}
                          className="w-10 h-10 rounded-lg object-cover border border-[#144930]"
                        />
                        <div>
                          <h5 className="font-bold text-white text-xs">{task.productName}</h5>
                          <span className="text-[10px] text-emerald-400">{task.partnerName}</span>
                        </div>
                      </div>
                      <span className="text-xs font-headline font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        +${task.rewardUsd.toFixed(2)} USD
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#144930]/40">
                      <span className="text-emerald-300/60">{task.engagements} Engagements</span>
                      <Button
                        size="sm"
                        onClick={() => setActiveUserTab('task')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-[10px] h-7 px-3 rounded-lg"
                      >
                        Complete Task
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. MY REFERRALS */}
        {activeSection === 'referrals' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-amber-400" />
                  Referral Network & Commissions
                </h3>
                <p className="text-xs text-emerald-300/80">Invite friends and earn lifetime commission rewards on all activities.</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                10% Referral Reward Rate
              </span>
            </div>

            <div className="bg-gradient-to-r from-[#0C3321] to-[#0A2719] border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Your Referral Code</span>
                <p className="text-xs text-emerald-300/80 mt-1">
                  Share this code with friends in Ghana. When they register, you receive automatic task commission overrides.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#061D12] border border-[#144930] p-2 px-4 rounded-xl">
                <span className="text-base font-headline font-extrabold text-amber-400 tracking-wider">
                  {user.referralCode}
                </span>
                <Button
                  size="sm"
                  onClick={copyReferralCode}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs h-8 px-3 rounded-lg"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
            </div>

            {/* Referral Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#061D12] border border-[#144930] p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Total Referrals</span>
                <div className="font-headline font-extrabold text-2xl text-white mt-1">{user.totalReferrals} Users</div>
              </div>

              <div className="bg-[#061D12] border border-[#144930] p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Active Members</span>
                <div className="font-headline font-extrabold text-2xl text-amber-400 mt-1">{user.activeReferrals} Active</div>
              </div>

              <div className="bg-[#061D12] border border-[#144930] p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Referral Commissions</span>
                <div className="font-headline font-extrabold text-2xl text-white mt-1">$48.50 USD</div>
              </div>
            </div>
          </div>
        )}

        {/* 6. SUBSCRIPTION */}
        {activeSection === 'subscription' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Subscription Tier & Privileges
                </h3>
                <p className="text-xs text-emerald-300/80">Upgrade your tier to unlock higher daily task limits and payout perks.</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase">
                Active: {user.subscriptionLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Starter */}
              <div
                className={`border rounded-2xl p-5 space-y-4 relative ${
                  user.subscriptionLevel === 'starter'
                    ? 'bg-[#061D12] border-emerald-500 shadow-xl'
                    : 'bg-[#061D12]/50 border-[#144930]'
                }`}
              >
                <div>
                  <h4 className="font-headline font-bold text-white text-base">Starter Tier</h4>
                  <p className="text-xs text-emerald-300/60">Free Account</p>
                </div>
                <div className="font-headline font-extrabold text-2xl text-white">GH₵0 / mo</div>
                <ul className="space-y-2 text-xs text-emerald-300/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    5 Daily Tasks ($0.50 - $1.00/task)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    Standard MoMo Payouts
                  </li>
                </ul>
                <Button
                  onClick={() => changeSubscription('starter')}
                  disabled={user.subscriptionLevel === 'starter'}
                  className="w-full bg-[#0A2719] hover:bg-[#0C3321] text-emerald-300 border border-[#144930] font-bold text-xs py-2 rounded-xl"
                >
                  {user.subscriptionLevel === 'starter' ? 'Current Plan' : 'Select Starter'}
                </Button>
              </div>

              {/* Pro */}
              <div
                className={`border rounded-2xl p-5 space-y-4 relative ${
                  user.subscriptionLevel === 'pro'
                    ? 'bg-[#061D12] border-emerald-500 shadow-xl'
                    : 'bg-[#061D12]/50 border-[#144930]'
                }`}
              >
                <div>
                  <h4 className="font-headline font-bold text-white text-base">Pro Tier</h4>
                  <p className="text-xs text-emerald-300/60">Popular Choice</p>
                </div>
                <div className="font-headline font-extrabold text-2xl text-white">GH₵180 / mo</div>
                <ul className="space-y-2 text-xs text-emerald-300/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    10 Daily Tasks ($1.00 - $1.50/task)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    Priority MoMo Settlement
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    10% Referral Overrides
                  </li>
                </ul>
                <Button
                  onClick={() => changeSubscription('pro')}
                  disabled={user.subscriptionLevel === 'pro'}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs py-2 rounded-xl"
                >
                  {user.subscriptionLevel === 'pro' ? 'Current Plan' : 'Switch to Pro'}
                </Button>
              </div>

              {/* Master */}
              <div
                className={`border rounded-2xl p-5 space-y-4 relative ${
                  user.subscriptionLevel === 'master'
                    ? 'bg-[#061D12] border-amber-500 shadow-xl shadow-amber-500/10'
                    : 'bg-[#061D12]/50 border-[#144930]'
                }`}
              >
                <div className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  VIP MASTER
                </div>
                <div>
                  <h4 className="font-headline font-bold text-white text-base">Master Tier</h4>
                  <p className="text-xs text-amber-300/60">Maximum Earnings</p>
                </div>
                <div className="font-headline font-extrabold text-2xl text-amber-400">GH₵420 / mo</div>
                <ul className="space-y-2 text-xs text-emerald-300/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    20 Daily High-Reward Tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    Instant Automated MoMo Payouts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    Exclusive Promo Campaign Access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    Dedicated Account Manager
                  </li>
                </ul>
                <Button
                  onClick={() => changeSubscription('master')}
                  disabled={user.subscriptionLevel === 'master'}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs py-2 rounded-xl shadow-lg shadow-amber-400/20"
                >
                  {user.subscriptionLevel === 'master' ? 'Current Plan' : 'Upgrade to Master'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 7. PAYMENT METHODS */}
        {activeSection === 'payment' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Saved Mobile Money & Payment Methods
                </h3>
                <p className="text-xs text-emerald-300/80">Manage accounts for automatic earnings withdrawal payouts.</p>
              </div>
              <Button
                onClick={() => setIsAddPmOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add MoMo Account
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="bg-[#061D12] border border-[#144930] p-4 rounded-xl space-y-3 relative">
                  {pm.isDefault && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      DEFAULT PAYOUT
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      {pm.network.includes('MTN') ? 'MTN' : pm.network.includes('Telecel') ? 'TCL' : 'ATG'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{pm.network}</h4>
                      <p className="text-xs text-emerald-300/80 font-headline font-bold">{pm.momoNumber}</p>
                      <p className="text-[10px] text-emerald-300/60">Account: {pm.accountName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#144930]/40 text-xs">
                    {!pm.isDefault ? (
                      <button
                        onClick={() => setDefaultPaymentMethod(pm.id)}
                        className="text-emerald-400 hover:underline font-bold text-[11px]"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-300/50">Primary Account</span>
                    )}

                    <button onClick={() => removePaymentMethod(pm.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Payment Dialog */}
            <Dialog open={isAddPmOpen} onOpenChange={setIsAddPmOpen}>
              <DialogContent className="bg-[#0A2719] border-[#144930] text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-headline font-bold text-lg text-white">Add Mobile Money Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddPaymentSubmit} className="space-y-4 py-2">
                  <div>
                    <label className="text-xs font-bold text-emerald-300 block mb-1">Select Network</label>
                    <select
                      value={newPmNetwork}
                      onChange={(e) => setNewPmNetwork(e.target.value)}
                      className="w-full bg-[#061D12] border border-[#144930] text-white text-xs rounded-xl p-2.5 outline-none"
                    >
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Telecel Cash">Telecel Cash (Vodafone)</option>
                      <option value="AirtelTigo Money">AirtelTigo Money (AT Money)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-emerald-300 block mb-1">Account Holder Name</label>
                    <Input
                      type="text"
                      value={newPmName}
                      onChange={(e) => setNewPmName(e.target.value)}
                      placeholder="e.g. Robert Paul"
                      className="bg-[#061D12] border-[#144930] text-white text-xs rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-emerald-300 block mb-1">Mobile Money Number</label>
                    <Input
                      type="text"
                      value={newPmNumber}
                      onChange={(e) => setNewPmNumber(e.target.value)}
                      placeholder="e.g. 0241234567"
                      className="bg-[#061D12] border-[#144930] text-white text-xs rounded-xl"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="pmDefault"
                      checked={newPmDefault}
                      onChange={(e) => setNewPmDefault(e.target.checked)}
                      className="rounded bg-[#061D12] border-[#144930] text-emerald-500"
                    />
                    <label htmlFor="pmDefault" className="text-xs text-emerald-300 cursor-pointer">
                      Set as primary default withdrawal method
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddPmOpen(false)}
                      className="border-[#144930] text-emerald-300 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-emerald-500 text-black font-bold text-xs">
                      Save Account
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* 8. NOTIFICATIONS */}
        {activeSection === 'notifications' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-400" />
                  Activity & Notification Center
                </h3>
                <p className="text-xs text-emerald-300/80">Stay updated on task approvals, payouts, and order dispatches.</p>
              </div>
              <Button
                onClick={markAllNotificationsAsRead}
                size="sm"
                className="bg-[#061D12] hover:bg-[#0C3321] text-emerald-300 border border-[#144930] text-xs px-3 rounded-lg"
              >
                Mark All Read
              </Button>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    n.read
                      ? 'bg-[#061D12]/60 border-[#144930]/60 opacity-80'
                      : 'bg-[#061D12] border-emerald-500/40 shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs">{n.title}</h4>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                      </div>
                      <p className="text-xs text-emerald-300/80 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-emerald-300/50 mt-1 block">{n.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notification Preference Toggles */}
            <div className="pt-4 border-t border-[#144930] space-y-3">
              <h4 className="font-headline font-bold text-white text-sm">Alert & Push Preferences</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    { key: 'emailAlerts', label: 'Email Withdrawal Statements' },
                    { key: 'smsAlerts', label: 'SMS Payout Confirmations' },
                    { key: 'taskReminders', label: 'Daily Task Reminders' },
                    { key: 'promoOffers', label: 'Partner Promo Announcements' },
                  ] as const
                ).map((pref) => (
                  <div
                    key={pref.key}
                    onClick={() => toggleNotificationPref(pref.key)}
                    className="bg-[#061D12] border border-[#144930] p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition-all"
                  >
                    <span className="text-xs font-semibold text-white">{pref.label}</span>
                    <div
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                        user.notificationPreferences?.[pref.key] ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-black transition-transform ${
                          user.notificationPreferences?.[pref.key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 9. SETTINGS */}
        {activeSection === 'settings' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-400" />
                  Account & App Settings
                </h3>
                <p className="text-xs text-emerald-300/80">Configure application display, security, and regional settings.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Display Currency */}
              <div className="bg-[#061D12] border border-[#144930] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Primary Display Currency</h4>
                  <p className="text-[11px] text-emerald-300/60">Choose preferred balance display format.</p>
                </div>
                <div className="flex items-center gap-1 bg-[#0A2719] p-1 rounded-xl border border-[#144930]">
                  <button
                    onClick={() => setCurrencyPref('USD')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      currencyPref === 'USD' ? 'bg-emerald-500 text-black' : 'text-emerald-300'
                    }`}
                  >
                    $ USD
                  </button>
                  <button
                    onClick={() => setCurrencyPref('GHS')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      currencyPref === 'GHS' ? 'bg-emerald-500 text-black' : 'text-emerald-300'
                    }`}
                  >
                    GH₵ GHS
                  </button>
                </div>
              </div>

              {/* Biometric Security */}
              <div className="bg-[#061D12] border border-[#144930] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Biometric & PIN Withdrawal Authorization</h4>
                  <p className="text-[11px] text-emerald-300/60">Require FaceID / Fingerprint lock before approving MoMo payouts.</p>
                </div>
                <button
                  onClick={() => setBiometricEnabled(!biometricEnabled)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                    biometricEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black transition-transform ${
                      biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Account Security */}
              <div className="bg-[#061D12] border border-[#144930] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Account Password & Credentials</h4>
                  <p className="text-[11px] text-emerald-300/60">Last updated 30 days ago.</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => alert('Password reset link sent to your email!')}
                  className="bg-[#0A2719] hover:bg-[#0C3321] text-emerald-300 border border-[#144930] text-xs h-8 px-3 rounded-lg"
                >
                  Reset Password
                </Button>
              </div>

              {/* Reset to Clean Real Data */}
              <div className="bg-[#061D12] border border-[#144930] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Reset User Data & Restore Defaults</h4>
                  <p className="text-[11px] text-emerald-300/60">Clear cached data and revert to clean account state.</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    resetToRealUserData();
                    alert('User data cache cleared! Reverted to clean user state.');
                  }}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs h-8 px-3 rounded-lg"
                >
                  Reset User Cache
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 10. HELP & SUPPORT */}
        {activeSection === 'help' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  Help Center & Customer Support
                </h3>
                <p className="text-xs text-emerald-300/80">Get fast answers or contact EarnBull support specialists in Ghana.</p>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="mailto:support@earnbull.com"
                className="bg-[#061D12] border border-[#144930] hover:border-emerald-500/40 p-4 rounded-xl flex items-center gap-3 transition-all"
              >
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Email Support</h4>
                  <p className="text-[10px] text-emerald-300/60">support@earnbull.com</p>
                </div>
              </a>

              <a
                href="https://wa.me/233241234567"
                target="_blank"
                rel="noreferrer"
                className="bg-[#061D12] border border-[#144930] hover:border-emerald-500/40 p-4 rounded-xl flex items-center gap-3 transition-all"
              >
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">WhatsApp Hotline</h4>
                  <p className="text-[10px] text-emerald-300/60">+233 24 123 4567</p>
                </div>
              </a>

              <div className="bg-[#061D12] border border-[#144930] p-4 rounded-xl flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Support Hours</h4>
                  <p className="text-[10px] text-emerald-300/60">Mon - Sat: 8AM - 8PM GMT</p>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-headline font-bold text-white text-sm">Frequently Asked Questions</h4>
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-2.5" />
                  <Input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search FAQ..."
                    className="bg-[#061D12] border-[#144930] text-white text-[11px] pl-8 h-8 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="bg-[#061D12] border border-[#144930] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-3 text-left font-bold text-xs text-white flex items-center justify-between gap-2"
                    >
                      <span>{faq.q}</span>
                      <ChevronRight
                        className={`w-4 h-4 text-emerald-400 transition-transform ${openFaqIndex === idx ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-3 pt-0 text-xs text-emerald-300/80 border-t border-[#144930]/40 bg-[#0A2719]/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Support Message Form */}
            <div className="bg-[#061D12] border border-[#144930] p-5 rounded-xl space-y-4">
              <h4 className="font-headline font-bold text-white text-sm">Send a Direct Message to Support</h4>

              {supportSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Your message has been dispatched to EarnBull Support. We will reply via email shortly!
                </div>
              )}

              <form onSubmit={handleSupportSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-1">Issue Category</label>
                  <select
                    value={supportCategory}
                    onChange={(e) => setSupportCategory(e.target.value)}
                    className="w-full bg-[#0A2719] border border-[#144930] text-white text-xs rounded-xl p-2.5 outline-none"
                  >
                    <option value="Withdrawal Question">Withdrawal & MoMo Payout</option>
                    <option value="Task Verification">Promotional Task Verification</option>
                    <option value="Subscription Tier">Subscription Upgrade / Billing</option>
                    <option value="Bull Shop Order">Bull Shop Order Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-1">Describe Your Inquiry</label>
                  <textarea
                    rows={3}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Provide details about your question..."
                    className="w-full bg-[#0A2719] border border-[#144930] text-white text-xs rounded-xl p-2.5 outline-none resize-none"
                    required
                  />
                </div>

                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-5 py-2 rounded-xl">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* 11. TERMS & CONDITIONS */}
        {activeSection === 'terms' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  EarnBull CP Ltd — Terms & Conditions
                </h3>
                <p className="text-xs text-emerald-300/80">Effective Date: January 1, 2024 (Version 2.4)</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-emerald-300/80 leading-relaxed">
              <h4 className="font-bold text-white text-sm">1. Account Eligibility & User Registration</h4>
              <p>
                By creating an account on EarnBull CP Ltd, you confirm that you are at least 18 years of age and reside in Ghana.
                Users must register with verified personal information and Mobile Money account credentials.
              </p>

              <h4 className="font-bold text-white text-sm">2. Promotional Tasks & Anti-Fraud Guidelines</h4>
              <p>
                Promotional commission rewards ($ USD) are earned by completing partner questions accurately and engaging with brand pages.
                Automated bots, fake engagement, or multiple account creation strictly result in immediate account termination.
              </p>

              <h4 className="font-bold text-white text-sm">3. Mobile Money Payouts & Settlement</h4>
              <p>
                Withdrawal requests are processed to MTN Mobile Money, Telecel Cash, or AT Money based on specified exchange rates ($1.00 = GH₵12.00).
                EarnBull CP Ltd reserves the right to hold suspicious transactions for verification.
              </p>

              <h4 className="font-bold text-white text-sm">4. Subscription Tiers & Services</h4>
              <p>
                Users can upgrade their subscription plan (Starter, Pro, Master) to increase daily task limits. Subscription fees are final and non-refundable.
              </p>
            </div>
          </div>
        )}

        {/* 12. PRIVACY POLICY */}
        {activeSection === 'privacy' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  EarnBull CP Ltd — Privacy Policy
                </h3>
                <p className="text-xs text-emerald-300/80">Data Protection & Privacy Standards</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-emerald-300/80 leading-relaxed">
              <h4 className="font-bold text-white text-sm">1. Information We Collect</h4>
              <p>
                We collect personal information including full name, email address, phone number, location, and Mobile Money numbers required for processing task earnings and delivery orders.
              </p>

              <h4 className="font-bold text-white text-sm">2. How We Secure Your Data</h4>
              <p>
                All financial data and Mobile Money details are encrypted using 256-bit SSL protocols. EarnBull CP Ltd does not share personal contact details with unauthorized third parties.
              </p>

              <h4 className="font-bold text-white text-sm">3. Partner Engagement Analytics</h4>
              <p>
                Aggregated, non-personally identifiable promotional task engagement stats are shared with registered corporate brand partners to confirm promotional campaign metrics.
              </p>
            </div>
          </div>
        )}

        {/* 13. ABOUT EARNBULL CP LTD */}
        {activeSection === 'about' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#144930] pb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-400" />
                  About EarnBull CP Ltd
                </h3>
                <p className="text-xs text-emerald-300/80">Ghana's Premier Brand Promotion & Rewards Ecosystem.</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Registered Corporate Entity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-xs text-emerald-300/80">
                <h4 className="font-headline font-bold text-white text-base">Corporate Mission</h4>
                <p>
                  EarnBull CP Ltd bridges the gap between top Ghanaian corporate brands (Nike Ghana, Samsung, MTN, Coca-Cola, Adidas) and verified consumers by offering direct commission rewards for brand engagement.
                </p>
                <p>
                  With over GH₵500,000 paid to users across Ghana, EarnBull CP Ltd delivers genuine product e-commerce and instant Mobile Money earnings.
                </p>
              </div>

              <div className="bg-[#061D12] border border-[#144930] p-4 rounded-xl space-y-3 text-xs">
                <h4 className="font-bold text-white">Company Headquarters</h4>
                <p className="text-emerald-300/80 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  14 Independence Avenue, Ridge, Accra, Ghana
                </p>
                <p className="text-emerald-300/80 flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                  Reg. No: CS-2024-EARNBULL-GH
                </p>

                <div className="pt-2 border-t border-[#144930] flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold">50+ Corporate Partners</span>
                  <span className="text-amber-400 font-bold">15,000+ Active Earners</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 14. LOGOUT */}
        {activeSection === 'logout' && (
          <div className="bg-[#0A2719] border border-[#144930] rounded-2xl p-8 text-center space-y-6 max-w-lg mx-auto shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400">
              <LogOut className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-headline font-bold text-xl text-white">Confirm Sign Out</h3>
              <p className="text-xs text-emerald-300/70 mt-1">
                Are you sure you want to end your active session, {user.displayName}? You can log back in at any time.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => setActiveSection('profile')}
                variant="outline"
                className="border-[#144930] text-emerald-300 text-xs px-6 py-2.5 rounded-xl"
              >
                Cancel
              </Button>

              <Button
                onClick={logoutUser}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-red-500/20"
              >
                Yes, Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
