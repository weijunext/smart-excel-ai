import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getCurrentUser } from "@/lib/session";
import { HomeLayoutChildren } from "@/types/layout";
import { UserInfo } from "@/types/user";

export default async function HomePageLayout({ children }: HomeLayoutChildren) {
  const user = (await getCurrentUser()) as UserInfo;

  return (
    <>
      <DashboardLayout children={children} user={user} />
    </>
  );
}
