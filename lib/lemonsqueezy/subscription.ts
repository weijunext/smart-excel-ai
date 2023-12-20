import { MEMBERSHIP_ROLE_VALUE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { LemonsqueezySubscriptionURLPatch, SubScriptionInfo } from "@/types/subscribe";
import { UserId } from "@/types/user";
import { client } from "./lemons";

export async function getUserSubscriptionPlan({ userId }: UserId) {
  const user = await prisma.user.findUnique({
    where: { userId },
    select: {
      subscriptionId: true,
      currentPeriodEnd: true,
      customerId: true,
      variantId: true,
    },
  });

  if (!user) throw new Error("User not found");
  if (!user.subscriptionId) return null

  const membershipExpire = (user.currentPeriodEnd || 0) * 1000
  const subscription = await client.retrieveSubscription({ id: user.subscriptionId });

  const attributes = subscription.data.attributes
  const urls = attributes.urls as LemonsqueezySubscriptionURLPatch

  // Check if user is on a pro plan.
  const isMembership =
    user.variantId &&
    membershipExpire > Date.now().valueOf();

  // If user has a pro plan, check cancel status on Stripe.
  let isCanceled = false;
  if (isMembership && user.subscriptionId) {
    isCanceled = attributes.cancelled;
  }

  return {
    subscriptionId: user.subscriptionId,
    membershipExpire: isMembership ? membershipExpire : 0,
    customerId: user.customerId,
    variantId: user.variantId,
    role: isMembership ? MEMBERSHIP_ROLE_VALUE : 0, // 2 : 0
    isCanceled,
    updatePaymentMethodURL: urls.update_payment_method,
    customerPortal: urls.customer_portal,
  } as SubScriptionInfo;
}