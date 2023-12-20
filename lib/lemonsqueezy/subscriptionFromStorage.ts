/**
 * Retrieve the user's role and membership expiration date from the database.
 */
import { MEMBERSHIP_ROLE_VALUE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { SubScriptionInfo } from "@/types/subscribe";
import { PrismaUser } from "@/types/user";

export async function getUserSubscriptionStatus({ userId, defaultUser }: { userId: string; defaultUser?: PrismaUser }) {
  let user = null
  if (defaultUser) {
    user = defaultUser
  } else {
    user = await prisma.user.findUnique({
      where: { userId },
      select: {
        subscriptionId: true,
        currentPeriodEnd: true,
        customerId: true,
        variantId: true,
      },
    });
  }

  if (!user) throw new Error("User not found");

  const membershipExpire = (user.currentPeriodEnd || 0) * 1000 // 13-digit timestamp or non-member
  const isMembership =
    user.variantId &&
    membershipExpire > Date.now().valueOf();

  return {
    subscriptionId: user.subscriptionId,
    membershipExpire: isMembership ? membershipExpire : 0,
    customerId: user.customerId,
    variantId: user.variantId,
    role: isMembership ? MEMBERSHIP_ROLE_VALUE : 0, // 2 : 0
  } as SubScriptionInfo;
}