import { UserInfo } from "@/types/user";

export interface HomeLayoutChildren {
  children?: React.ReactNode;
}
export interface HomeLayoutProps extends HomeLayoutChildren {
  user?: UserInfo;
}