'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserProfile,
  PartnerCompany,
  Product,
  PromotionalTask,
  CartItem,
  Order,
  PromoCampaign,
  Transaction,
  WithdrawalRequest,
  SubscriptionLevel,
  SystemAlert,
  PaymentMethod,
  NotificationItem,
} from '@/lib/types';

type ActiveRole = 'user' | 'partner' | 'admin';
type UserTab = 'task' | 'shop' | 'promo' | 'more' | 'home';

interface EarnBullContextType {
  // Role & View State
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
  activeUserTab: UserTab;
  setActiveUserTab: (tab: UserTab) => void;
  activeMoreSection: string | null;
  setActiveMoreSection: (section: string | null) => void;
  
  // Modals & Active Selections
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Data
  user: UserProfile;
  partners: PartnerCompany[];
  products: Product[];
  tasks: PromotionalTask[];
  cart: CartItem[];
  orders: Order[];
  promos: PromoCampaign[];
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  alerts: SystemAlert[];
  paymentMethods: PaymentMethod[];
  notifications: NotificationItem[];
  isLoggedOut: boolean;

  // User Actions
  updateProfile: (data: Partial<UserProfile>) => void;
  addPaymentMethod: (pm: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  toggleNotificationPref: (key: 'emailAlerts' | 'smsAlerts' | 'taskReminders' | 'promoOffers') => void;
  logoutUser: () => void;
  loginUser: () => void;
  resetToRealUserData: () => void;
  changeSubscription: (level: SubscriptionLevel) => void;
  submitTask: (taskId: string, answerIndex: number) => { success: boolean; message: string; reward: number };
  toggleLikeTask: (taskId: string) => void;
  toggleFollowTask: (taskId: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  checkout: (shippingAddress: string) => { success: boolean; message: string };
  requestWithdrawal: (amountUsd: number, momoNumber: string, accountName: string) => { success: boolean; message: string };

  // Partner Actions
  selectedPartnerId: string;
  setSelectedPartnerId: (id: string) => void;
  addPartnerProductAndTask: (product: Omit<Product, 'id'>, task: Omit<PromotionalTask, 'id' | 'productId'>) => void;

  // Admin Actions
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string) => void;
}

const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm-1', network: 'MTN Mobile Money', accountName: 'Robert Paul', momoNumber: '0241234567', isDefault: true },
  { id: 'pm-2', network: 'Telecel Cash', accountName: 'Robert Paul', momoNumber: '0209876543', isDefault: false },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'Withdrawal Successful', message: 'Your Mobile Money withdrawal of $20.00 (GH₵240.00) was processed.', type: 'withdrawal', read: false, timestamp: '10 mins ago' },
  { id: 'notif-2', title: 'Task Commission Credited', message: 'You earned +$1.00 USD for completing Nike Air Max 270 task.', type: 'task', read: false, timestamp: '2 hours ago' },
  { id: 'notif-3', title: 'Order #ORD-1025 Shipped', message: 'Your Bull Shop order has been dispatched for delivery to Accra.', type: 'order', read: true, timestamp: '1 day ago' },
  { id: 'notif-4', title: 'Weekend Boost Campaign', message: 'Earn +50% extra bonus commission on all Nike promotional tasks!', type: 'promo', read: true, timestamp: '2 days ago' },
];

const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  email: 'robert.paul@example.com',
  displayName: 'Robert Paul',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  phoneNumber: '+233 24 123 4567',
  address: '14 Independence Avenue, Ridge, Accra, Ghana',
  joinedDate: 'January 2024',
  subscriptionLevel: 'master',
  availableBalanceUsd: 124.50,
  pendingEarningsUsd: 12.50,
  totalEarnedUsd: 568.75,
  ghsBalance: 1250.00,
  tasksCompletedToday: 5,
  totalTasksTodayLimit: 10,
  referralCode: 'EARN-PAUL88',
  totalReferrals: 14,
  activeReferrals: 11,
  payoutDetails: {
    accountName: 'Robert Paul',
    momoNumber: '0241234567',
    network: 'MTN Mobile Money',
  },
  savedPaymentMethods: INITIAL_PAYMENT_METHODS,
  notificationPreferences: {
    emailAlerts: true,
    smsAlerts: true,
    taskReminders: true,
    promoOffers: false,
  },
};

const INITIAL_PARTNERS: PartnerCompany[] = [
  { id: 'part_nike', name: 'Nike Ghana', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', industry: 'Sports & Apparel', verified: true, totalTasks: 48, totalEngagements: 18752, totalCommissionPaidUsd: 5430.00, totalSalesGhs: 12560.75 },
  { id: 'part_samsung', name: 'Samsung Ghana', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=150&q=80', industry: 'Electronics', verified: true, totalTasks: 36, totalEngagements: 14210, totalCommissionPaidUsd: 3850.20, totalSalesGhs: 18900.00 },
  { id: 'part_mtn', name: 'MTN Ghana', logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80', industry: 'Telecom & Tech', verified: true, totalTasks: 34, totalEngagements: 12400, totalCommissionPaidUsd: 3612.10, totalSalesGhs: 9400.00 },
  { id: 'part_coca', name: 'Coca-Cola Ghana', logo: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=150&q=80', industry: 'Beverages', verified: true, totalTasks: 30, totalEngagements: 11200, totalCommissionPaidUsd: 2980.00, totalSalesGhs: 4200.00 },
  { id: 'part_adidas', name: 'Adidas Ghana', logo: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=150&q=80', industry: 'Sports & Apparel', verified: true, totalTasks: 42, totalEngagements: 15400, totalCommissionPaidUsd: 4210.50, totalSalesGhs: 11200.00 },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-nike-airmax',
    partnerId: 'part_nike',
    partnerName: 'Nike Ghana',
    name: 'Nike Air Max 270',
    description: 'Experience unbeatable comfort and style with the latest Nike Air Max. Perfect for running, everyday wear, and urban performance.',
    priceGhs: 850.00,
    originalPriceGhs: 1000.00,
    rewardUsd: 1.00,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    sku: 'NIKE-AM270-GHA',
    rating: 4.8,
    reviewCount: 128,
    isFeatured: true,
    hasTask: true,
  },
  {
    id: 'prod-samsung-buds2',
    partnerId: 'part_samsung',
    partnerName: 'Samsung Ghana',
    name: 'Galaxy Buds 2 Pro',
    description: 'Immersive sound, Active Noise Canceling, and seamless connectivity tailored for your everyday life.',
    priceGhs: 1200.00,
    originalPriceGhs: 1450.00,
    rewardUsd: 1.50,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    stock: 14,
    sku: 'SAMS-GBUDS2-PRO',
    rating: 4.7,
    reviewCount: 95,
    isFeatured: true,
    hasTask: true,
  },
  {
    id: 'prod-cocacola-500',
    partnerId: 'part_coca',
    partnerName: 'Coca-Cola Ghana',
    name: 'Coca-Cola 500ml (Pack of 12)',
    description: 'Crisp, refreshing taste that uplifts every moment. Ice-cold refreshment guaranteed.',
    priceGhs: 65.00,
    originalPriceGhs: 80.00,
    rewardUsd: 0.80,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    stock: 100,
    sku: 'COCA-500ML-PK12',
    rating: 4.9,
    reviewCount: 310,
    isFeatured: false,
    hasTask: true,
  },
  {
    id: 'prod-mtn-router',
    partnerId: 'part_mtn',
    partnerName: 'MTN Ghana',
    name: 'MTN 5G Broadband Router',
    description: 'Ultra-fast 5G wireless internet router for home and business with seamless high-speed coverage.',
    priceGhs: 650.00,
    originalPriceGhs: 800.00,
    rewardUsd: 1.20,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    stock: 40,
    sku: 'MTN-5G-ROUTER',
    rating: 4.6,
    reviewCount: 84,
    isFeatured: true,
    hasTask: true,
  },
  {
    id: 'prod-adidas-tshirt',
    partnerId: 'part_adidas',
    partnerName: 'Adidas Ghana',
    name: 'Adidas Essentials 3-Stripes Tee',
    description: 'Classic cotton athletic t-shirt with signature 3-stripes detailing along the shoulders.',
    priceGhs: 220.00,
    originalPriceGhs: 280.00,
    rewardUsd: 0.90,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    stock: 60,
    sku: 'ADID-3STRIPE-TEE',
    rating: 4.5,
    reviewCount: 64,
    isFeatured: false,
    hasTask: true,
  },
  {
    id: 'prod-infinix-hot40',
    partnerId: 'part_samsung',
    partnerName: 'Infinix Ghana',
    name: 'Infinix Hot 40 Pro',
    description: 'High performance gaming smartphone featuring 120Hz display and 108MP camera system.',
    priceGhs: 1450.00,
    originalPriceGhs: 1650.00,
    rewardUsd: 1.30,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    stock: 18,
    sku: 'INF-HOT40-PRO',
    rating: 4.6,
    reviewCount: 112,
    isFeatured: false,
    hasTask: true,
  },
];

const INITIAL_TASKS: PromotionalTask[] = [
  {
    id: 'task-nike-airmax',
    productId: 'prod-nike-airmax',
    partnerId: 'part_nike',
    partnerName: 'Nike Ghana',
    partnerLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80',
    productName: 'Nike Air Max 270',
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    rewardUsd: 1.00,
    likePartnerUrl: 'https://facebook.com/nikeghana',
    followPartnerUrl: 'https://instagram.com/nikeghana',
    partnerSocialHandle: '@nikeghana',
    question: 'What material is mainly used in the upper of this Nike Air Max 270?',
    options: ['Leather', 'Mesh', 'Rubber', 'Cotton'],
    correctAnswerIndex: 1, // Mesh
    totalCompleted: 2542,
    engagements: 3210,
    status: 'active',
    likesCount: 3210,
    followersCount: 12450,
    isLiked: false,
    isFollowed: false,
  },
  {
    id: 'task-samsung-buds2',
    productId: 'prod-samsung-buds2',
    partnerId: 'part_samsung',
    partnerName: 'Samsung Ghana',
    partnerLogo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=150&q=80',
    productName: 'Galaxy Buds 2 Pro',
    productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    rewardUsd: 1.50,
    likePartnerUrl: 'https://facebook.com/samsungghana',
    followPartnerUrl: 'https://instagram.com/samsungghana',
    partnerSocialHandle: '@samsungghana',
    question: 'Which key audio technology is built into the Galaxy Buds 2 Pro?',
    options: ['Active Noise Cancellation (ANC)', 'Solar Charging', 'Wired Only Audio', 'Analog FM Radio'],
    correctAnswerIndex: 0, // ANC
    totalCompleted: 1987,
    engagements: 2450,
    status: 'active',
    likesCount: 2450,
    followersCount: 9820,
    isLiked: false,
    isFollowed: false,
  },
  {
    id: 'task-cocacola-500',
    productId: 'prod-cocacola-500',
    partnerId: 'part_coca',
    partnerName: 'Coca-Cola Ghana',
    partnerLogo: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=150&q=80',
    productName: 'Coca-Cola 500ml',
    productImage: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    rewardUsd: 0.80,
    likePartnerUrl: 'https://facebook.com/cocacolaghana',
    followPartnerUrl: 'https://instagram.com/cocacolaghana',
    partnerSocialHandle: '@cocacolaghana',
    question: 'What is the world-famous primary brand color of Coca-Cola?',
    options: ['Ocean Blue', 'Iconic Red', 'Bright Yellow', 'Emerald Green'],
    correctAnswerIndex: 1, // Red
    totalCompleted: 3100,
    engagements: 4120,
    status: 'active',
    likesCount: 4120,
    followersCount: 15300,
    isLiked: false,
    isFollowed: false,
  },
  {
    id: 'task-mtn-router',
    productId: 'prod-mtn-router',
    partnerId: 'part_mtn',
    partnerName: 'MTN Ghana',
    partnerLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80',
    productName: 'MTN 5G Router',
    productImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    rewardUsd: 1.20,
    likePartnerUrl: 'https://facebook.com/mtnghana',
    followPartnerUrl: 'https://instagram.com/mtnghana',
    partnerSocialHandle: '@mtnghana',
    question: 'What next-generation network standard powers this MTN Broadband Router?',
    options: ['2G Dialup', '4G LTE', '5G Ultra Broadband', 'Satellite Dish'],
    correctAnswerIndex: 2, // 5G
    totalCompleted: 1420,
    engagements: 1890,
    status: 'active',
    likesCount: 1890,
    followersCount: 8760,
    isLiked: false,
    isFollowed: false,
  },
  {
    id: 'task-adidas-tshirt',
    productId: 'prod-adidas-tshirt',
    partnerId: 'part_adidas',
    partnerName: 'Adidas Ghana',
    partnerLogo: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=150&q=80',
    productName: 'Adidas T-Shirt',
    productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    rewardUsd: 0.90,
    likePartnerUrl: 'https://facebook.com/adidasghana',
    followPartnerUrl: 'https://instagram.com/adidasghana',
    partnerSocialHandle: '@adidasghana',
    question: 'How many stripes feature on the signature Adidas design?',
    options: ['Two Stripes', 'Three Stripes', 'Four Stripes', 'Five Stripes'],
    correctAnswerIndex: 1, // 3 Stripes
    totalCompleted: 1683,
    engagements: 2150,
    status: 'active',
    likesCount: 2150,
    followersCount: 9100,
    isLiked: false,
    isFollowed: false,
  },
  {
    id: 'task-infinix-hot40',
    productId: 'prod-infinix-hot40',
    partnerId: 'part_samsung',
    partnerName: 'Infinix Ghana',
    partnerLogo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&q=80',
    productName: 'Infinix Hot 40',
    productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    rewardUsd: 1.30,
    likePartnerUrl: 'https://facebook.com/infinixghana',
    followPartnerUrl: 'https://instagram.com/infinixghana',
    partnerSocialHandle: '@infinixghana',
    question: 'What screen refresh rate makes gaming smooth on the Infinix Hot 40 Pro?',
    options: ['60Hz', '90Hz', '120Hz', '240Hz'],
    correctAnswerIndex: 2, // 120Hz
    totalCompleted: 1102,
    engagements: 1450,
    status: 'active',
    likesCount: 1450,
    followersCount: 6840,
    isLiked: false,
    isFollowed: false,
  },
];

const INITIAL_PROMOS: PromoCampaign[] = [
  {
    id: 'promo-weekend-boost',
    partnerId: 'part_nike',
    partnerName: 'Nike Ghana',
    title: 'Weekend Boost Campaign!',
    description: 'Complete extra promotional tasks this weekend and earn up to 50% extra reward commission on all sports items.',
    bannerImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    rewardText: 'Earn +$0.50 Bonus per task',
    startDate: 'May 20, 2025',
    endDate: 'May 26, 2025',
    eligibleLevels: ['pro', 'master'],
    status: 'active',
    engagements: 3254,
  },
  {
    id: 'promo-adidas-launch',
    partnerId: 'part_adidas',
    partnerName: 'Adidas Ghana',
    title: 'Adidas is Now Live on EarnBull!',
    description: 'Promote top athletic products from Adidas Ghana and get exclusive access to member-only Bull Shop discounts.',
    bannerImage: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80',
    rewardText: 'Exclusive 20% Off Code',
    startDate: 'May 18, 2025',
    endDate: 'May 30, 2025',
    eligibleLevels: ['starter', 'pro', 'master'],
    status: 'active',
    engagements: 2987,
  },
  {
    id: 'promo-mothers-day',
    partnerId: 'part_coca',
    partnerName: 'EarnBull CP Ltd',
    title: 'Mega Promo: Win Big This Season!',
    description: 'Top earners this week stand a chance to win GH₵5,000 cash prizes and free product gift hampers.',
    bannerImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    rewardText: 'GH₵5,000 Grand Prize',
    startDate: 'May 10, 2025',
    endDate: 'May 16, 2025',
    eligibleLevels: ['master'],
    status: 'ended',
    engagements: 4102,
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx-101', userId: 'usr_001', type: 'task-earned', amount: 1.00, currency: 'USD', date: '2025-05-25 14:30', description: 'Promotional Task Commission — Nike Air Max', status: 'completed' },
  { id: 'tx-102', userId: 'usr_001', type: 'task-earned', amount: 1.50, currency: 'USD', date: '2025-05-25 12:15', description: 'Promotional Task Commission — Galaxy Buds 2', status: 'completed' },
  { id: 'tx-103', userId: 'usr_001', type: 'withdraw', amount: 20.00, currency: 'USD', date: '2025-05-24 18:00', description: 'MoMo Withdrawal to 0241234567', status: 'completed' },
  { id: 'tx-104', userId: 'usr_001', type: 'shop-purchase', amount: 250.00, currency: 'GHS', date: '2025-05-23 10:45', description: 'Bull Shop Order #ORD-1024', status: 'completed' },
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  { id: 'wd-501', userId: 'usr_002', userName: 'John Doe', amountUsd: 120.00, amountGhs: 1440.00, momoNumber: '0249998877', accountName: 'John Doe', network: 'MTN Mobile Money', status: 'completed', requestedAt: 'May 25, 2025' },
  { id: 'wd-502', userId: 'usr_003', userName: 'Ama Darko', amountUsd: 80.00, amountGhs: 960.00, momoNumber: '0551122334', accountName: 'Ama Darko', network: 'Vodafone Cash', status: 'pending', requestedAt: 'May 25, 2025' },
  { id: 'wd-503', userId: 'usr_004', userName: 'Kofi Asante', amountUsd: 45.00, amountGhs: 540.00, momoNumber: '0277788990', accountName: 'Kofi Asante', network: 'AirtelTigo Money', status: 'completed', requestedAt: 'May 24, 2025' },
];

const INITIAL_ALERTS: SystemAlert[] = [
  { id: 'alt-1', type: 'withdrawal', message: '5 withdrawal requests pending admin approval', timeAgo: '10 min ago' },
  { id: 'alt-2', type: 'partner', message: 'New partner registration application: GCB Bank', timeAgo: '1 hour ago' },
  { id: 'alt-3', type: 'promo', message: 'Promo campaign "Weekend Boost" ending soon', timeAgo: '3 hours ago' },
  { id: 'alt-4', type: 'system', message: 'Automated commission settlement completed', timeAgo: '5 hours ago' },
];

const EarnBullContext = createContext<EarnBullContextType | undefined>(undefined);

export const EarnBullProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<ActiveRole>('user');
  const [activeUserTab, setActiveUserTab] = useState<UserTab>('task');
  const [activeMoreSection, setActiveMoreSection] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('part_nike');

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('earnbull_user');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (p && typeof p === 'object') {
            return {
              ...INITIAL_USER,
              ...p,
              notificationPreferences: {
                ...INITIAL_USER.notificationPreferences,
                ...(p.notificationPreferences || {}),
              },
            };
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_USER;
  });

  const [partners, setPartners] = useState<PartnerCompany[]>(INITIAL_PARTNERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [tasks, setTasks] = useState<PromotionalTask[]>(INITIAL_TASKS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('earnbull_tasks');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (Array.isArray(p) && p.length > 0) {
            setTasks(
              p.map((savedTask: PromotionalTask) => {
                const init = INITIAL_TASKS.find((t) => t.id === savedTask.id);
                return {
                  ...init,
                  ...savedTask,
                  likesCount: savedTask.likesCount ?? init?.likesCount ?? 100,
                  followersCount: savedTask.followersCount ?? init?.followersCount ?? 500,
                  isLiked: savedTask.isLiked ?? init?.isLiked ?? false,
                  isFollowed: savedTask.isFollowed ?? init?.isFollowed ?? false,
                };
              })
            );
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('earnbull_orders');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (Array.isArray(p)) return p;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      {
        id: 'ORD-1025',
        userId: 'usr_001',
        userName: 'Robert Paul',
        items: [{ product: INITIAL_PRODUCTS[0], quantity: 1 }],
        totalGhs: 865.00,
        status: 'delivered',
        shippingAddress: '14 Independence Avenue, Accra',
        createdAt: 'May 25, 2025',
      },
      {
        id: 'ORD-1024',
        userId: 'usr_001',
        userName: 'Robert Paul',
        items: [{ product: INITIAL_PRODUCTS[2], quantity: 2 }],
        totalGhs: 145.00,
        status: 'processing',
        shippingAddress: '14 Independence Avenue, Accra',
        createdAt: 'May 24, 2025',
      },
    ];
  });

  const [promos] = useState<PromoCampaign[]>(INITIAL_PROMOS);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('earnbull_transactions');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (Array.isArray(p)) return p;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('earnbull_withdrawals');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (Array.isArray(p)) return p;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_WITHDRAWALS;
  });

  const [alerts] = useState<SystemAlert[]>(INITIAL_ALERTS);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('earnbull_payment_methods');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (Array.isArray(p)) return p;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_PAYMENT_METHODS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('earnbull_notifications');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (Array.isArray(p)) return p;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('earnbull_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('earnbull_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('earnbull_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('earnbull_withdrawals', JSON.stringify(withdrawals));
    }
  }, [withdrawals]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('earnbull_payment_methods', JSON.stringify(paymentMethods));
    }
  }, [paymentMethods]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('earnbull_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('earnbull_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const resetToRealUserData = () => {
    setUser(INITIAL_USER);
    setPaymentMethods(INITIAL_PAYMENT_METHODS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setTasks(INITIAL_TASKS);
    setIsLoggedOut(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('earnbull_user');
      localStorage.removeItem('earnbull_orders');
      localStorage.removeItem('earnbull_transactions');
      localStorage.removeItem('earnbull_withdrawals');
      localStorage.removeItem('earnbull_payment_methods');
      localStorage.removeItem('earnbull_notifications');
      localStorage.removeItem('earnbull_tasks');
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const addPaymentMethod = (pm: Omit<PaymentMethod, 'id'>) => {
    const newPm: PaymentMethod = {
      ...pm,
      id: `pm-${Date.now()}`,
    };
    setPaymentMethods((prev) => {
      const updated = pm.isDefault ? prev.map((p) => ({ ...p, isDefault: false })) : [...prev];
      return [...updated, newPm];
    });
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleNotificationPref = (key: 'emailAlerts' | 'smsAlerts' | 'taskReminders' | 'promoOffers') => {
    setUser((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences!,
        [key]: !prev.notificationPreferences?.[key],
      },
    }));
  };

  const logoutUser = () => {
    setIsLoggedOut(true);
  };

  const loginUser = () => {
    setIsLoggedOut(false);
  };

  const changeSubscription = (level: SubscriptionLevel) => {
    const limits = { starter: 5, pro: 10, master: 20 };
    setUser((prev) => ({
      ...prev,
      subscriptionLevel: level,
      totalTasksTodayLimit: limits[level],
    }));
  };

  const submitTask = (taskId: string, answerIndex: number) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return { success: false, message: 'Task not found', reward: 0 };

    if (answerIndex !== targetTask.correctAnswerIndex) {
      return { success: false, message: 'Incorrect answer. Please review the question and try again!', reward: 0 };
    }

    const reward = targetTask.rewardUsd;

    // Credit User Balance
    setUser((prev) => ({
      ...prev,
      availableBalanceUsd: prev.availableBalanceUsd + reward,
      totalEarnedUsd: prev.totalEarnedUsd + reward,
      tasksCompletedToday: prev.tasksCompletedToday + 1,
    }));

    // Increment Task Stats
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, totalCompleted: t.totalCompleted + 1, status: 'completed' } : t))
    );

    // Record Transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      type: 'task-earned',
      amount: reward,
      currency: 'USD',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Task Completed: ${targetTask.productName}`,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      message: `Task Verified! +$${reward.toFixed(2)} credited to your available balance.`,
      reward,
    };
  };

  const toggleLikeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const currentlyLiked = !!t.isLiked;
          const currentLikes = t.likesCount ?? 100;
          return {
            ...t,
            isLiked: !currentlyLiked,
            likesCount: currentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
          };
        }
        return t;
      })
    );
  };

  const toggleFollowTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const currentlyFollowed = !!t.isFollowed;
          const currentFollowers = t.followersCount ?? 500;
          return {
            ...t,
            isFollowed: !currentlyFollowed,
            followersCount: currentlyFollowed ? Math.max(0, currentFollowers - 1) : currentFollowers + 1,
          };
        }
        return t;
      })
    );
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const checkout = (shippingAddress: string) => {
    if (cart.length === 0) return { success: false, message: 'Cart is empty' };

    const totalGhs = cart.reduce((sum, item) => sum + item.product.priceGhs * item.quantity, 0) + 15.00; // Delivery fee

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.id,
      userName: user.displayName,
      items: [...cart],
      totalGhs,
      status: 'processing',
      shippingAddress: shippingAddress || 'Accra Central, Ghana',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);

    return { success: true, message: `Order #${newOrder.id} placed successfully! Total: GH₵${totalGhs.toFixed(2)}` };
  };

  const requestWithdrawal = (amountUsd: number, momoNumber: string, accountName: string) => {
    if (amountUsd > user.availableBalanceUsd) {
      return { success: false, message: 'Insufficient available balance' };
    }
    if (amountUsd <= 0) {
      return { success: false, message: 'Invalid withdrawal amount' };
    }

    const amountGhs = amountUsd * 12.0; // 1 USD = 12 GHS rate

    setUser((prev) => ({
      ...prev,
      availableBalanceUsd: prev.availableBalanceUsd - amountUsd,
    }));

    const newWd: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      userId: user.id,
      userName: user.displayName,
      amountUsd,
      amountGhs,
      momoNumber,
      accountName,
      network: 'MTN Mobile Money',
      status: 'pending',
      requestedAt: 'Just now',
    };

    setWithdrawals((prev) => [newWd, ...prev]);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      type: 'withdraw',
      amount: amountUsd,
      currency: 'USD',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Withdrawal Request to ${momoNumber} (${accountName})`,
      status: 'pending',
    };
    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      message: `Withdrawal request of $${amountUsd.toFixed(2)} (GH₵${amountGhs.toFixed(2)}) submitted successfully.`,
    };
  };

  const addPartnerProductAndTask = (
    productData: Omit<Product, 'id'>,
    taskData: Omit<PromotionalTask, 'id' | 'productId'>
  ) => {
    const productId = `prod-${Date.now()}`;
    const taskId = `task-${Date.now()}`;

    const newProduct: Product = {
      ...productData,
      id: productId,
    };

    const newTask: PromotionalTask = {
      ...taskData,
      id: taskId,
      productId: productId,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setTasks((prev) => [newTask, ...prev]);
  };

  const approveWithdrawal = (id: string) => {
    setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'completed' } : w)));
  };

  const rejectWithdrawal = (id: string) => {
    setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'rejected' } : w)));
  };

  return (
    <EarnBullContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeUserTab,
        setActiveUserTab,
        activeMoreSection,
        setActiveMoreSection,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,
        selectedTaskId,
        setSelectedTaskId,
        selectedProductId,
        setSelectedProductId,
        isCartOpen,
        setIsCartOpen,
        user,
        partners,
        products,
        tasks,
        cart,
        orders,
        promos,
        transactions,
        withdrawals,
        alerts,
        paymentMethods,
        notifications,
        isLoggedOut,
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
        changeSubscription,
        submitTask,
        toggleLikeTask,
        toggleFollowTask,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkout,
        requestWithdrawal,
        selectedPartnerId,
        setSelectedPartnerId,
        addPartnerProductAndTask,
        approveWithdrawal,
        rejectWithdrawal,
      }}
    >
      {children}
    </EarnBullContext.Provider>
  );
};

export const useEarnBull = () => {
  const context = useContext(EarnBullContext);
  if (!context) throw new Error('useEarnBull must be used within an EarnBullProvider');
  return context;
};
