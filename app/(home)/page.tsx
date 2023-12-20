import { getCurrentUser } from "@/lib/session";
import { checkStatus, getUsage } from "@/lib/usage/usage";
import { UserInfo } from "@/types/user";
import HomePage from "./homePage";

export default async function Page() {
  const usage: number = (await getUsage()) as number;
  const user = (await getCurrentUser()) as UserInfo;

  // 获取用户当日剩余次数
  // Get the user's remaining count for the day
  let userUsageInfo = {
    role: 0,
    todayRemaining: 0,
    boostPackRemaining: 0,
    membershipExpire: 0,
    boostPackExpire: 0,
  };
  if (user && user.userId) {
    /**
     * 根据角色判断可使用的次数
     * 1、普通用户返回当日剩余次数，月会员返回当日剩余次数和过期时间
     * 2、加油包用户返回剩余次数和过期时间
     * 3、以上两条可同时展示
     *
     * Determine the number of times that can be used based on the role
     * 1. Ordinary users return the remaining number of times for the day, monthly members return the remaining number of times for the day and the expiration time
     * 2. Boost pack users return the remaining number of times and the expiration time
     * 3. The above two points can be displayed at the same time
     */
    userUsageInfo = await checkStatus({ userId: user.userId });
  }
  const remaining = userUsageInfo.todayRemaining;
  const membershipExpire = userUsageInfo.membershipExpire;
  const boostPackRemaining = userUsageInfo.boostPackRemaining;
  const boostPackExpire = userUsageInfo.boostPackExpire
    ? Math.floor(new Date().getTime() / 1000) + userUsageInfo.boostPackExpire
    : 0;

  return (
    <HomePage
      usage={usage}
      user={user}
      remaining={remaining}
      boostPackRemaining={boostPackRemaining}
      membershipExpire={membershipExpire}
      boostPackExpire={boostPackExpire}
    />
  );
}
