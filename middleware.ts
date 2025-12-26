import { NextResponse, type NextRequest } from "next/server";
import { getAccessToken } from "@/utils/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const tokenExpire = request.cookies.get("token_expire");
  const requestHeaders = new Headers(request.headers);

  if (token?.value && tokenExpire?.value) {
    const isNotExpired = Date.now() < Number(tokenExpire.value);

    if (isNotExpired) {
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }
  }

  const { access_token, expires_in } = await getAccessToken();

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const expiresAt = Date.now() + expires_in * 1000;

  response.cookies.set("token", access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  });

  response.cookies.set("token_expire", String(expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|static|monitoring).*)",
  ],
};
