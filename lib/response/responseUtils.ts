import { NextResponse } from "next/server";

export function unauthorizedResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 401 });
}