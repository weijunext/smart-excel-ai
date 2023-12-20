/**
 * 0 普通用户; 2 会员
 * Role values: 0 for Basic User; 2 for Member
 */

import { VariantIdsByType } from "@/types/subscribe";
import { Role, UserId } from "@/types/user";

// Definitions for user roles.
export const ROLES: { [key in Role]: string } = {
  0: 'Basic',
  2: 'MemberShip',
}

// Daily usage limits for different roles.
export const ROLES_LIMIT: { [key in Role]: number } = {
  0: process.env.NEXT_PUBLIC_COMMON_USER_DAILY_LIMIT_STR && Number(process.env.NEXT_PUBLIC_COMMON_USER_DAILY_LIMIT_STR) || 10,
  2: process.env.NEXT_PUBLIC_MEMBERSHIP_DAILY_LIMIT_STR && Number(process.env.NEXT_PUBLIC_MEMBERSHIP_DAILY_LIMIT_STR) || 500,
}


export const ONE_DAY = 3600 * 24
export const DATE_USAGE_KEY_EXPIRE = 3600 * 24 * 10 // 10天，用户日用量保存时长 10 days, duration for saving daily user usage data
export const MEMBERSHIP_ROLE_VALUE = 2 // 月度会员的值 The value for monthly membership
export const BOOST_PACK_EXPIRE = ONE_DAY * Number(process.env.NEXT_PUBLIC_BOOST_PACK_EXPIRE_DAYS || 7) // 7天，购买加油包的使用期限 7 days, usage duration for a purchased boost pack
export const BOOST_PACK_CREDITS = Number(process.env.NEXT_PUBLIC_BOOST_PACK_CREDITS || 100) // 每次购买加油包获得的次数  Number of uses received per boost pack purchase

// Functions to create cache keys for tracking user data.
export const getUserDateUsageKey = ({ userId }: UserId) => {
  const currentDate = new Date().toLocaleDateString();
  return `uid:${userId}::date:${currentDate}::user_date_usage`
}
export const getUserTotalUsageKey = ({ userId }: UserId) => {
  const key = `USER_USAGE::uid:${userId}`;
  return key
}
export const getBoostPackKey = ({ userId }: UserId) => {
  return `uid:${userId}::boost_pack_balance`
}

// Variant keys for subscription types.
export const SUBSCRIPTION_VARIANT_KEY = 'subscription'
export const SINGLE_VARIANT_KEY = 'single'
// Variant IDs for different subscription types, to be used in checkouts and webhooks.
export const VARIANT_IDS_BY_TYPE: VariantIdsByType = {
  'subscription': process.env.LEMON_SQUEEZY_MEMBERSHIP_MONTHLY_VARIANT_ID || '', // checkouts 请求传参要用string，但是webhook收到的variant_id是number
  'single': process.env.LEMON_SQUEEZY_MEMBERSHIP_SINGLE_TIME_VARIANT_ID || '',
}
// Function to generate a cache key for single payment orders.
export const getSinglePayOrderKey = ({ identifier }: { identifier: string }) => {
  return `single_${identifier}`
}