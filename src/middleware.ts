import { NextResponse } from "next/server";

export const config = {
  matcher: ["/"]
};

// Simple middleware that allows all requests
export function middleware() {
  return NextResponse.next();
}
