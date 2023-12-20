import redis from "@/lib/redis";

export async function verifyReferer(request: Request) {
  const referer = request.headers.get('referer');
  if (!referer || !referer.includes(process.env.REFERER_MAIN_URL as string)) {
    return false;
  }
  return true;
}

export async function verifyToken(request: Request) {
  const token = request.headers.get('token');
  if (!token) {
    return false;
  }
  const userId = await redis.get(token) + '';
  if (!userId) {
    return false;
  }
  return userId;
}