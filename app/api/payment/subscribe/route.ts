import { axios } from "@/lib/axios";
import { MEMBERSHIP_ROLE_VALUE, VARIANT_IDS_BY_TYPE } from "@/lib/constants";
import { getUserSubscriptionPlan } from "@/lib/lemonsqueezy/subscription";
import prisma from "@/lib/prisma";
import { unauthorizedResponse } from "@/lib/response/responseUtils";
import { verifyReferer, verifyToken } from "@/lib/verifyUtils/verifyUtils";
import { UpgradeType, } from "@/types/subscribe";
import type { CreateCheckoutResult } from "lemonsqueezy.ts/dist/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 判断referer
    // Check the referer
    if (!(await verifyReferer(request))) {
      return unauthorizedResponse("Invalid referer.");
    }
    // 判断token是否存在
    // Verify if token exists
    const redisUserId: string | false = await verifyToken(request);
    if (!redisUserId) {
      return unauthorizedResponse("Token validation failed. Please login again.");
    }

    const { userId, type }: { userId: string, type: UpgradeType } = await request.json()
    if (!userId) {
      return unauthorizedResponse("Your account was not found");
    }
    const variantId = VARIANT_IDS_BY_TYPE[type]
    if (!type || !variantId) {
      return unauthorizedResponse("Your account was not found");
    }

    const user = await prisma.user.findUnique({
      where: { userId: userId.toString() },
      select: { userId: true, email: true, username: true },
    });

    if (!user) return NextResponse.json({ message: "user not found" }, { status: 401 });

    const checkout = (await axios.post(
      `${process.env.LEMON_SQUEEZY_HOST}/checkouts`,
      {
        data: {
          type: "checkouts",
          attributes: { checkout_data: { custom: { email: user.email, userId: user.userId, username: user.username, type } } },
          relationships: {
            store: { data: { type: "stores", id: process.env.LEMON_SQUEEZY_STORE_ID } },
            variant: { data: { type: "variants", id: variantId.toString() } },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      }
    )) as CreateCheckoutResult;

    return NextResponse.json({ checkoutURL: checkout.data.attributes.url }, { status: 200 });
  } catch (error: any) {
    console.error('POST request failed:', error);
    return NextResponse.json({
      error: "An unexpected error occurred. Please try again later."
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // 判断referer
    // Check the referer
    if (!(await verifyReferer(request))) {
      return unauthorizedResponse("Invalid referer.");
    }
    // 判断token是否存在
    // Verify if token exists
    const redisUserId: string | false = await verifyToken(request);
    if (!redisUserId) {
      return unauthorizedResponse("Token validation failed. Please login again.");
    }

    // 查询订阅信息
    // Query subscription information
    const subscriptionPlan = await getUserSubscriptionPlan({ userId: redisUserId })
    // 校验角色
    // Validate roles
    if (!subscriptionPlan) {
      const errorText = `you're not a pro user.`
      return NextResponse.json({ message: errorText }, { status: 401 });
    }
    if (subscriptionPlan.role !== MEMBERSHIP_ROLE_VALUE) {
      const errorText = `you're not a pro user.`
      return NextResponse.json({ message: errorText }, { status: 401 });
    }
    // 校验订阅状态
    // Check the subscription status
    if (subscriptionPlan.isCanceled) {
      const errorText = `your subscription already canceled.`
      return NextResponse.json({ message: errorText }, { status: 401 });
    }

    // 调用 lemon squeezy 取消订阅
    // Call lemon squeezy to cancel the subscription 
    const unsubscribeRes = (await axios.delete(
      `${process.env.LEMON_SQUEEZY_HOST}/subscriptions/${subscriptionPlan.subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      }
    ));
    // 根据返回处理，如果错误，提供错误提示，如果正确，提供已取消提示
    // console.log(unsubscribeRes, JSON.stringify(unsubscribeRes));
    if (unsubscribeRes?.data?.attributes?.cancelled) {
      return NextResponse.json({ message: 'success' }, { status: 200 });
    }
    return NextResponse.json({ message: 'fail' }, { status: 400 });
  } catch (error) {
    console.error('DELETE request failed:', error);
    return NextResponse.json({
      error: "An unexpected error occurred. Please try again later."
    }, { status: 500 });
  }
}