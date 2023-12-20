import { DATE_USAGE_KEY_EXPIRE, ROLES_LIMIT, getBoostPackKey, getUserDateUsageKey, getUserTotalUsageKey } from "@/lib/constants";
import { getUserSubscriptionStatus } from "@/lib/lemonsqueezy/subscriptionFromStorage";
import redis from "@/lib/redis";
import { DateRemaining } from "@/types/usage";
import { RemainingParams, Role, UserId } from "@/types/user";
import 'server-only';

interface IncrAfterChat {
  userId: string;
  remainingInfo: DateRemaining;
}
export const incrAfterChat = async ({ userId, remainingInfo }: IncrAfterChat) => {
  // 网站总使用用量自增
  // Increment website total usage after chat
  incrUsage()

  /**
   * 用户使用量自增
   * Increment user usage
   */

  // 如果有默认次数，增加一次日使用次数
  // If there is a default number of times, add one to the daily usage count
  if (remainingInfo.userTodayRemaining > 0) {
    await incrementDailyUserUsage({ userId })
    return
  }
  // 如果没有默认次数，有加油包，扣除加油包次数
  // If there is no default number but a boost pack is available, deduct from the boost pack count
  if (remainingInfo.boostPackRemaining > 0) {
    const boostPackKey = await getBoostPackKey({ userId })
    await redis.decr(boostPackKey)
    return
  }
  // 如果没有默认次数，也没有加油包，则不处理
  // If there is no default number or boost pack, do nothing
  console.log('0 credit remaining today.');
}

// 自增网站总使用次数
// Increment total website usage count
export const incrUsage = async () => {
  await redis.incr('usage');
}
// 获取网站总使用次数
// Get total website usage count
export const getUsage = async () => {
  const usage = await redis.get('usage') || 0;
  return usage
}

// 自增用户使用次数，这个方法用于内部调用
// Increment user's daily usage count, this method is for internal use
export const incrementDailyUserUsage = async ({ userId }: UserId) => {
  const keyDate = getUserDateUsageKey({ userId });
  const keyTotal = getUserTotalUsageKey({ userId })

  // 使用 Redis pipeline
  // Use Redis pipeline
  const pipeline = redis.pipeline();
  // 将所有命令加入 pipeline
  // Add all commands to the pipeline
  pipeline.incr(keyDate); // 增加日使用量 Increase daily usage
  pipeline.incr(keyTotal); // 增加总使用量 Increase total usage
  pipeline.expire(keyDate, DATE_USAGE_KEY_EXPIRE); // 设置日使用量的过期时间 // Set expiration time for daily usage

  try {
    await pipeline.exec();
  } catch (error) {
    console.error('An error occurred while incrementing user usage data:', error);
  }
}

// 获取用户日使用次数
// Get User's daily usage count
export const getUserDateUsage = async ({ userId }: UserId) => {
  const keyDate = getUserDateUsageKey({ userId });
  const userTodayUsageStr = await redis.get(keyDate) as string | null;
  const userTodayUsage = parseInt(userTodayUsageStr ?? '0', 10);
  return { userTodayUsage };
}
// 获取用户总使用次数
// Get user's total usage count
export const getUserTotalUsage = async ({ userId }: UserId) => {
  const keyTotal = `USER_USAGE::uid:${userId}`;
  const userTotalUsageStr = await redis.get(keyTotal) as string | null;
  const userTotalUsage = parseInt(userTotalUsageStr ?? '0', 10);
  return {
    userTotalUsage
  }
}

// 计算当日可用次数：查询当日已用次数，计算剩余次数，再加上加油包剩余次数
// Calculate the available number of times for the day: Query the number of times used that day, calculate the remaining number, and then add the remaining number of boost packs
export const getUserDateRemaining = async ({ userId, role }: RemainingParams) => {
  const { userTodayUsage } = await getUserDateUsage({ userId })

  let userRole: Role = 0
  if (role) {
    // 有传角色，复用订阅信息
    // If the role is passed, reuse subscription information
    userRole = role
  } else {
    // 没传角色，重新请求订阅信息
    // If no role is passed, request subscription information again
    const subscriptionRes = await getUserSubscriptionStatus({
      userId,
    })
    userRole = subscriptionRes.role
  }

  const userDateDefaultLimit: number = ROLES_LIMIT[userRole]

  const userTodayRemaining = userDateDefaultLimit - userTodayUsage <= 0 ? 0 : userDateDefaultLimit - userTodayUsage
  const boostPackKey = await getBoostPackKey({ userId })
  const boostPackRemaining: number = await redis.get(boostPackKey) || 0
  // 查询次数是在请求openai前，自增次数是在请求后，这里把查询到的redis剩余次数返回，并传给自增方法，减少redis请求次数
  // The query for the number of times is before the request to openai, and the increment of the number of times is after the request, here the remaining redis times queried are returned and passed to the increment method, reducing the number of redis requests
  return {
    userTodayRemaining,
    boostPackRemaining,
    userDateRemaining: userTodayRemaining + boostPackRemaining
  }
}
// 计算当日剩余次数、会员到期时间、加油包剩余次数、加油包到期时间
// Calculate today's remaining count, membership expiration time, remaining boost pack count, and boost pack expiration time
export const checkStatus = async ({ userId }: UserId) => {
  // 获取用户订阅信息（角色、会员到期时间戳）
  // Get user subscription information
  const subscriptionRes = await getUserSubscriptionStatus({
    userId,
  });

  const pipeline = redis.pipeline();
  const keyDate = getUserDateUsageKey({ userId });
  pipeline.get(keyDate);
  const boostPackKey = getBoostPackKey({ userId });
  pipeline.get(boostPackKey);

  const pipelineResults = await pipeline.exec();
  const userTodayUsageStr = pipelineResults[0] as string;
  const boostPackRemainingStr = pipelineResults[1] as string;

  const userTodayUsage = parseInt(userTodayUsageStr ?? '0', 10);
  const boostPackRemaining = parseInt(boostPackRemainingStr ?? '0', 10);

  const userDateDefaultLimit: number = ROLES_LIMIT[subscriptionRes.role];
  const userTodayRemaining = Math.max(userDateDefaultLimit - userTodayUsage, 0);

  // 获取加油包到期时间，如果有剩余次数
  // remaining boost pack count, and boost pack expiration time.
  let boostPackExpire = 0
  if (boostPackRemaining > 0) {
    boostPackExpire = await redis.ttl(boostPackKey)
  }

  return {
    role: subscriptionRes.role,
    todayRemaining: userTodayRemaining,
    membershipExpire: subscriptionRes.membershipExpire,
    boostPackRemaining,
    boostPackExpire,
  };
};

// 升级后清空当日已用次数
// Clear the day's used count after upgrade.
export const clearTodayUsage = async ({ userId }: UserId) => {
  const userDateUsageKey = getUserDateUsageKey({ userId })
  await redis.setex(userDateUsageKey, DATE_USAGE_KEY_EXPIRE, 0)
}