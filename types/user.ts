import { User } from "@prisma/client";

export type Role = 0 | 2; // 0 Standard User; 2 Member User

export type RedisUserId = string | null

export interface UserId {
  userId: string;
}

export interface RemainingParams {
  userId: string;
  role?: Role;
}

export interface UserInfo {
  userId: string;
  username: string;
  avatar?: string;
  platform: string;
  email: string;
  role: Role;
  membershipExpire?: number;
  accessToken?: string;
}

export interface PrismaUser extends User { }