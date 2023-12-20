import { BOOST_PACK_CREDITS, BOOST_PACK_EXPIRE, getBoostPackKey } from "@/lib/constants";
import redis from "@/lib/redis";
import { UserId } from "@/types/user";
import 'server-only';

/**
 * 设计：购买加油包
 * 如果已有加油包（expire存在且大于当前时间），expire + 7天，oldBalance + BOOST_PACK_CREDITS
 * 如果没有加油包，设置expire为 0 + 7天，0 + BOOST_PACK_CREDITS
 *
 * Logic: Purchase of boost pack
 * If a boost pack already exists (expire exists and is greater than the current time), extend expire by 7 days, and add BOOST_PACK_CREDITS to oldBalance
 * If no boost pack exists, set expire to current time + 7 days, and set balance to BOOST_PACK_CREDITS
 */
export const boostPack = async ({ userId }: UserId) => {
  const userBoostPackKey = await getBoostPackKey({ userId })
  const userBoostPack = await redis.get(userBoostPackKey) || 0
  if (userBoostPack === 0) {
    const res = await redis.set(userBoostPackKey, BOOST_PACK_CREDITS, { ex: BOOST_PACK_EXPIRE })
    if (res === 'OK') {
      return { userId, balance: BOOST_PACK_CREDITS, expire: BOOST_PACK_EXPIRE, boostPack: 'success' }
    }
    return { userId, balance: 0, expire: 0, boostPack: 'fail' }
  }
  // 已是加油包用户，查询过期时间，计算新的过期时间，更新过期时间
  // For existing boost pack users, query the expiration time, calculate the new expiration time, and update the expiration time.
  const oldBalance: number = await redis.get(userBoostPackKey) || 0
  const TTL = await redis.ttl(userBoostPackKey)
  const newTTL = TTL + BOOST_PACK_EXPIRE
  const newBalance = oldBalance + BOOST_PACK_CREDITS
  const res = await redis.setex(userBoostPackKey, newTTL, newBalance)
  return res === 'OK' ?
    { userId, oldBalance, newBalance, expire: newTTL, boostPack: 'success' } :
    { userId, oldBalance, newBalance: oldBalance, expire: TTL, boostPack: 'fail' }
}