import { Role } from "@/types/user";

export interface Subscription {
  isPopular?: boolean;
  title: string;
  description: string;
  amount: number | string;
  expireType?: 'day' | 'week' | 'month' | 'year';
  possess: string[];
  mainClassName?: string;
  buttonClassName?: string;
  buttonText?: string;
};

export interface SubscribeInfo {
  [key: string]: Subscription;
};

export interface CreateCheckoutResponse {
  checkoutURL: string;
};

export interface SubScriptionInfo {
  subscriptionId: string | number;
  membershipExpire: number;
  customerId: string;
  variantId: number;
  role: Role;
  isCanceled?: boolean;
  updatePaymentMethodURL?: string;
  customerPortal?: string;
}
export type UpgradeType = 'subscription' | 'single';

export type VariantIdsByType = {
  [key in UpgradeType]: string;
};

// billing 页面显示的内容
export interface UserSubscriptionPlan extends SubScriptionInfo {
  name: string
  description: string
  isPro: boolean
}
export interface LemonsqueezySubscriptionURLPatch {
  update_payment_method: string
  customer_portal: string
}
