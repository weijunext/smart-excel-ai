import { HomeLayout } from "@/components/layout/HomeLayout";
import { getCurrentUser } from "@/lib/session";
import { HomeLayoutChildren } from "@/types/layout";
import { UserInfo } from "@/types/user";

export default async function HomePageLayout({ children }: HomeLayoutChildren) {
  const user = (await getCurrentUser()) as UserInfo;

  return (
    <>
      <HomeLayout children={children} user={user} />
    </>
  );
}
