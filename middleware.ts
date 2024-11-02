import { NextResponse } from 'next/server';

// 和app在同一层级
export function middleware(request: Request) {
  // console.log("mmmm")

  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}