import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    // Redirect back to home with error
    const url = new URL("/", request.url);
    url.searchParams.set("error", "spotify_auth_failed");
    return NextResponse.redirect(url);
  }

  if (!code) {
    const url = new URL("/", request.url);
    url.searchParams.set("error", "no_code");
    return NextResponse.redirect(url);
  }

  // Get userId from sessionStorage (we'll pass it via state parameter)
  // For now, try to get from localStorage via redirect
  const url = new URL("/", request.url);
  url.searchParams.set("spotify_code", code);
  
  // Redirect to home page which will handle the callback
  return NextResponse.redirect(url);
}

