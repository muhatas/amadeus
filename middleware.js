import { NextResponse } from "next/server";

// Utils
import { getAccessToken } from "./src/utils/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  let token = request.cookies.get("token");
  let token_expire = request.cookies.get("token_expire");
  const requestHeaders = new Headers(request.headers);

  if (token && token_expire) {
    const isNotExpired = Date.now() < Number(token_expire.value);

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

  const expiresAt = Date.now() + Number(expires_in) * 1000;

  response.cookies.set("token", access_token);
  response.cookies.set("token_expire", expiresAt);

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|static|monitoring).*)",
  ],
};
