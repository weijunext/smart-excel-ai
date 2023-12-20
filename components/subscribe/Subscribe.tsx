import SubscribeCard from "@/components/subscribe/SubscribeCard";
import { axios } from "@/lib/axios";
import {
  BOOST_PACK_CREDITS,
  BOOST_PACK_EXPIRE,
  SINGLE_VARIANT_KEY,
  SUBSCRIPTION_VARIANT_KEY,
} from "@/lib/constants";
import { CreateCheckoutResponse, SubscribeInfo } from "@/types/subscribe";
import { UserInfo } from "@/types/user";
import { toast } from "react-hot-toast";

export const subscribeInfo: SubscribeInfo = {
  free: {
    title: "Free",
    description: "Begin Your Exploration Journey",
    amount: 0,
    expireType: "day",
    possess: [
      `${
        process.env.NEXT_PUBLIC_COMMON_USER_DAILY_LIMIT_STR || "10"
      } free credits per day`,
      "Optional credits purchase",
    ],
  },
  membership: {
    isPopular: true,
    title: "Premium",
    description: "50x more credits than Free version",
    amount: 4.99,
    expireType: "month",
    possess: [
      "Up to 500 credits per day",
      "Optional credits purchase",
      "Early access to new features",
    ],
    buttonText: "Upgrade Now",
    mainClassName: "purple-500",
    buttonClassName: "bg-gradient-to-r from-pink-500 to-purple-500",
  },
  boostPack: {
    title: "Boost Pack",
    description: "Enough for a worry-free week",
    amount: Number(process.env.NEXT_PUBLIC_BOOST_PACK_PRICE || "0"),
    // expireType: "",
    possess: [
      "One-off buy",
      `${BOOST_PACK_CREDITS || "100"} credits ${
        BOOST_PACK_EXPIRE / 3600 / 24
      }-day validity`,
      "No auto-renewal after expiry",
    ],
    buttonText: `Get ${BOOST_PACK_CREDITS || "100"} credits`,
  },
};

export default function Subscribe({ user }: { user: UserInfo | null }) {
  const getStartFreeVersion = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const subscribe = async () => {
    if (!user || !user.userId) {
      toast.error("Please login first");
      return;
    }
    try {
      const { checkoutURL } = await axios.post<any, CreateCheckoutResponse>(
        "/api/payment/subscribe",
        {
          userId: user.userId,
          type: SUBSCRIPTION_VARIANT_KEY,
        },
        {
          headers: {
            token: user.accessToken,
          },
        }
      );
      window.location.href = checkoutURL;
      // window.open(checkoutURL, "_blank", "noopener, noreferrer");
    } catch (err) {
      console.log(err);
    }
  };
  const purchase = async () => {
    if (!user || !user.userId) {
      toast.error("Please login first");
      return;
    }
    console.log("purchase");
    try {
      const { checkoutURL } = await axios.post<any, CreateCheckoutResponse>(
        "/api/payment/subscribe",
        {
          userId: user.userId,
          type: SINGLE_VARIANT_KEY,
        },
        {
          headers: {
            token: user.accessToken,
          },
        }
      );
      window.location.href = checkoutURL;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold mb-8 text-zinc-800">UPGRADE</h1>
      </div>
      <section className="w-full py-0 flex items-center justify-center">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            <SubscribeCard
              info={subscribeInfo.free}
              clickButton={getStartFreeVersion}
            />
            <SubscribeCard
              id="subscription-card"
              info={subscribeInfo.membership}
              clickButton={subscribe}
            />
            <SubscribeCard
              id="bootsPack-card"
              info={subscribeInfo.boostPack}
              clickButton={purchase}
            />
          </div>
        </div>
      </section>
      {/* <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      /> */}
    </div>
  );
}
