import { LemonsqueezyClient } from "lemonsqueezy.ts";

export const client = new LemonsqueezyClient(process.env.LEMON_SQUEEZY_API_KEY as string);