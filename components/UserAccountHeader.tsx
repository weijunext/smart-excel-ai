"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { UserAvatar } from "@/components/UserAvatar";
import CrownIcon from "@/components/icons/CrownIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user";
import dayjs from "dayjs";
import { useCallback } from "react";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<
    UserInfo,
    "username" | "avatar" | "email" | "role" | "membershipExpire"
  >;
}

export default function UserAccountHeader({ user }: UserAccountNavProps) {
  const getMembershipExpire = useCallback(() => {
    return dayjs(user.membershipExpire).format("YYYY-MM-DD HH:mm");
  }, [user.membershipExpire]);

  return (
    <>
      {user && user.username ? (
        <div className="flex items-center">
          <div className="mr-2">{user.role > 0 ? <CrownIcon /> : <></>}</div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar
                user={{
                  username: user.username,
                  avatar: user.avatar,
                  role: user.role,
                  email: user.email,
                }}
                className="h-8 w-8"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <div className="">
                    <div className="font-medium">{user.username}</div>
                    <div className="mr-2 mt-2 flex">
                      {user.role > 0 ? (
                        <>
                          <CrownIcon />{" "}
                          <span className="text-sm text-gray-500">
                            ({getMembershipExpire()})
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  {user.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => {
                  event.preventDefault();
                  signOut({
                    callbackUrl: `${window.location.origin}/login`,
                  });
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "px-4"
          )}
        >
          Login
        </Link>
      )}
    </>
  );
}
