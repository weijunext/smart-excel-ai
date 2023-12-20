import { ONE_DAY, getSinglePayOrderKey } from "@/lib/constants";
import { client } from "@/lib/lemonsqueezy/lemons";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { boostPack } from "@/lib/upgrade/upgrade";
import { clearTodayUsage } from "@/lib/usage/usage";
import { Buffer } from "buffer";
import crypto from "crypto";
import dayjs from "dayjs";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import rawBody from "raw-body";
import { Readable } from "stream";

export async function POST(request: Request) {
  console.log('webhook');
  const body = await rawBody(Readable.from(Buffer.from(await request.text())));
  const headersList = headers();
  const payload = JSON.parse(body.toString());

  const sigString = headersList.get("x-signature");
  if (!sigString) {
    console.error(`Signature header not found`);
    return NextResponse.json({ message: "Signature header not found" }, { status: 401 });
  }
  const secret = process.env.LEMONS_SQUEEZY_SIGNATURE_SECRET as string;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");
  const signature = Buffer.from(
    Array.isArray(sigString) ? sigString.join("") : sigString || "",
    "utf8"
  );
  // validate signature
  if (!crypto.timingSafeEqual(digest, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  const userId = payload.meta.custom_data && payload.meta.custom_data.userId || '';
  // Check if custom defined data i.e. the `userId` is there or not
  if (!userId) {
    return NextResponse.json({ message: "No userId provided" }, { status: 403 });
  }
  const user = await prisma.user.findUnique({
    where: { userId: userId.toString() },
    select: { userId: true, email: true, username: true },
  });
  if (!user) return NextResponse.json({ message: "Your account was not found" }, { status: 401 });

  const first_order_item = payload.data.attributes.first_order_item || null

  // is one-off
  if (first_order_item && parseInt(first_order_item.variant_id, 10) === parseInt(process.env.LEMON_SQUEEZY_MEMBERSHIP_SINGLE_TIME_VARIANT_ID as string, 10)) {
    return await singlePayDeal(first_order_item, payload, userId)
  }
  // is subscription
  if (!first_order_item && parseInt(payload.data.attributes.variant_id, 10) === parseInt(process.env.LEMON_SQUEEZY_MEMBERSHIP_MONTHLY_VARIANT_ID as string, 10)) {
    return await subscriptionDeal(payload, userId)
  }
}

const singlePayDeal = async (first_order_item: any, payload: any, userId: string) => {
  try {
    // Check if the webhook event was for this product or not
    if (
      parseInt(first_order_item.product_id, 10) !==
      parseInt(process.env.LEMON_SQUEEZY_PRODUCT_ID as string, 10)
    ) {
      return NextResponse.json({ message: "Invalid product" }, { status: 403 });
    }

    switch (payload.meta.event_name) {
      case "order_created": {
        const subscription = await client.retrieveOrder({ id: payload.data.id });
        /**
         * Lemon Squeezy 可能推送多次，这里需要判断order是否已存在，相同order仅处理首次收到的推送
         * 检查redis里有没有存这个order_id，如果没有，则调用boostPack和redis保存，如果有，则不处理，直接返回200
         * 
         * Lemon Squeezy might push multiple times; here we need to determine if the order already exists. The same order should only be processed on the first received push.
         * Check if this order_id is stored in Redis. If not, call boostPack and save it in Redis. If it is, do not process, return 200 directly.
         */
        const key = await getSinglePayOrderKey({ identifier: payload.data.attributes.identifier })
        const orderRedisRes = await redis.get(key)
        console.log('orderRedisRes', orderRedisRes);
        if (!orderRedisRes) {
          await redis.setex(key, ONE_DAY, first_order_item.created_at)
          await boostPack({ userId })
        }
        return NextResponse.json({ status: 200 });
      }

      default: {
        return NextResponse.json({ message: 'event_name not support' }, { status: 400 });
      }
    }
  } catch (e) {
    console.log('single pay deal', e);
    return NextResponse.json({ message: 'single pay something wrong' }, { status: 500 });
  }
}
const subscriptionDeal = async (payload: any, userId: string) => {
  try {
    const attributes = payload.data.attributes
    // Check if the webhook event was for this product or not
    if (
      parseInt(attributes.product_id, 10) !==
      parseInt(process.env.LEMON_SQUEEZY_PRODUCT_ID as string, 10)
    ) {
      return NextResponse.json({ message: "Invalid product" }, { status: 403 });
    }

    switch (payload.meta.event_name) {
      case "subscription_created": {
        const subscription = await client.retrieveSubscription({ id: payload.data.id });
        // 订阅 subscription
        await prisma.user.update({
          where: { userId },
          data: {
            subscriptionId: `${subscription.data.id}`,
            customerId: `${payload.data.attributes.customer_id}`,
            variantId: subscription.data.attributes.variant_id,
            currentPeriodEnd: dayjs(subscription.data.attributes.renews_at).unix(),
          },
        });
        // 重置今天的积分
        // Reset today's points
        clearTodayUsage({ userId })
        return NextResponse.json({ status: 200 });
      }

      case "subscription_updated": {
        const subscription = await client.retrieveSubscription({ id: payload.data.id });
        // 订阅 subscription
        const user = await prisma.user.findUnique({
          where: { userId, subscriptionId: `${subscription.data.id}` },
          select: { subscriptionId: true },
        });
        if (!user || !user.subscriptionId) return NextResponse.json({ message: 'userId or subscriptionId not found' }, { status: 400 });;

        await prisma.user.update({
          where: { userId, subscriptionId: user.subscriptionId },
          data: {
            variantId: subscription.data.attributes.variant_id,
            currentPeriodEnd: dayjs(subscription.data.attributes.renews_at).unix(),
          },
        });
        // 重置今天的积分
        // Reset today's points
        clearTodayUsage({ userId })
        return NextResponse.json({ status: 200 });
      }

      default: {
        return NextResponse.json({ message: 'event_name not support' }, { status: 400 });
      }
    }
  } catch (e) {
    console.log('subscription deal', e);
    return NextResponse.json({ message: 'subscription something wrong' }, { status: 500 });
  }
}