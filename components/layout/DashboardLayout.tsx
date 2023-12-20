import { HomeLayoutProps } from "@/types/layout";
import { notFound } from "next/navigation";

export const DashboardLayout = ({ children, user }: HomeLayoutProps) => {
  if (!user) {
    return notFound();
  }
  return (
    <div className="max-full w-full mx-auto py-0 px-4 md:px-20">
      <main className="flex-1">{children}</main>
    </div>
  );
};
