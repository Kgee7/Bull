export type SubscriptionLevel = 'starter' | 'pro' | 'master';

export type PaymentMethod = {
  id: string;
  network: string; // 'MTN Mobile Money' | 'Telecel Cash' | 'AirtelTigo Money'
  accountName: string;
  momoNumber: string;
  isDefault: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: 'withdrawal' | 'task' | 'order' | 'promo' | 'system';
  read: boolean;
  timestamp: string;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  address?: string;
  joinedDate?: string;
  subscriptionLevel: SubscriptionLevel;
  availableBalanceUsd: number;
  pendingEarningsUsd: number;
  totalEarnedUsd: number;
  ghsBalance: number;
  tasksCompletedToday: number;
  totalTasksTodayLimit: number;
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  payoutDetails?: {
    accountName: string;
    momoNumber: string;
    network: string;
  };
  savedPaymentMethods?: PaymentMethod[];
  notificationPreferences?: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    taskReminders: boolean;
    promoOffers: boolean;
  };
};


export type PartnerCompany = {
  id: string;
  name: string;
  logo: string;
  industry: string;
  verified: boolean;
  totalTasks: number;
  totalEngagements: number;
  totalCommissionPaidUsd: number;
  totalSalesGhs: number;
};

export type ProductCategory = 'fashion' | 'electronics' | 'home' | 'beauty';

export type Product = {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerLogo?: string;
  name: string;
  description: string;
  priceGhs: number;
  originalPriceGhs?: number;
  rewardUsd: number;
  category: ProductCategory;
  image: string;
  gallery?: string[];
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  hasTask: boolean;
};

export type PromotionalTask = {
  id: string;
  productId: string;
  partnerId: string;
  partnerName: string;
  partnerLogo?: string;
  productName: string;
  productImage: string;
  rewardUsd: number;
  likePartnerUrl: string;
  followPartnerUrl: string;
  partnerSocialHandle: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  totalCompleted: number;
  engagements: number;
  status: 'active' | 'completed' | 'expired';
  likesCount?: number;
  followersCount?: number;
  isLiked?: boolean;
  isFollowed?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderStatus = 'processing' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalGhs: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
};

export type PromoCampaign = {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerLogo?: string;
  title: string;
  description: string;
  bannerImage: string;
  rewardText: string;
  startDate: string;
  endDate: string;
  eligibleLevels: SubscriptionLevel[];
  status: 'active' | 'upcoming' | 'ended';
  engagements: number;
};

export type TransactionType = 'task-earned' | 'withdraw' | 'shop-purchase' | 'referral-bonus';

export type Transaction = {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: 'USD' | 'GHS';
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'rejected';
};

export type WithdrawalRequest = {
  id: string;
  userId: string;
  userName: string;
  amountUsd: number;
  amountGhs: number;
  momoNumber: string;
  accountName: string;
  network: string;
  status: 'pending' | 'completed' | 'rejected';
  requestedAt: string;
};

export type SystemAlert = {
  id: string;
  type: 'withdrawal' | 'partner' | 'promo' | 'system';
  message: string;
  timeAgo: string;
};
