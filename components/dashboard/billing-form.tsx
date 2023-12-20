"use client";

import * as React from "react";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { axios } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Res } from "@/types/request";
import { UserSubscriptionPlan } from "@/types/subscribe";
import { UserInfo } from "@/types/user";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
  subscriptionPlan: UserSubscriptionPlan;
  user: UserInfo;
}

export function BillingForm({
  subscriptionPlan,
  user,
  className,
}: BillingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function updatePayment(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(!isLoading);
    if (subscriptionPlan.isPro && subscriptionPlan.updatePaymentMethodURL) {
      window.location.href = subscriptionPlan.updatePaymentMethodURL;
    }
  }
  async function upgrade(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(!isLoading);
    window.location.href = "/#subscription-card";
  }
  async function cancelSubscription() {
    console.log("cancel subscription", subscriptionPlan);
    if (!subscriptionPlan) {
      toast.error("subscriptionId not found");
      return;
    }
    if (!subscriptionPlan.subscriptionId) {
      toast.error("subscriptionId not found");
      return;
    }
    if (!subscriptionPlan.isPro) {
      toast.error("you don't have a subscription");
      return;
    }
    if (subscriptionPlan.isCanceled) {
      toast.error("subscription already canceled");
      return;
    }
    try {
      const res = await axios.delete<any, Res>("/api/payment/subscribe", {
        headers: {
          token: user.accessToken,
        },
      });
      if (res.code === 200) {
        router.replace("");
        return;
      }
      toast.error("something wrong");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={cn(className)}>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
            plan.
          </CardDescription>
        </CardHeader>
        <CardContent>{subscriptionPlan.description}</CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <div className="flex gap-4">
            {subscriptionPlan.isPro ? (
              <Button onClick={updatePayment}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Payment
              </Button>
            ) : (
              <Button onClick={upgrade}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upgrade to PRO
              </Button>
            )}
            {subscriptionPlan.isCanceled ? (
              <></>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Unsubscribe</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      After unsubscribing, you will lose your current privileges
                      once your current subscription expires.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close Dialog</AlertDialogCancel>
                    <AlertDialogAction onClick={cancelSubscription}>
                      Unsubscribe
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          {subscriptionPlan.isPro ? (
            <p className="rounded-full text-xs font-medium">
              {subscriptionPlan.isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on "}
              {dayjs(subscriptionPlan.membershipExpire).format(
                "YYYY-MM-DD HH:mm"
              )}
              .
            </p>
          ) : null}
        </CardFooter>
      </Card>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
    </div>
  );
}
