import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken } from "@/utils/auth";
import { getApiUrl } from "@/utils/env";

function buildTargetUrl(pathParts: string[], reqUrl: string) {
  const incoming = new URL(reqUrl);
  const apiUrl = getApiUrl();
  const target = new URL(`${apiUrl}/${pathParts.join("/")}`);
  target.search = incoming.search;
  return target;
}

async function ensureValidToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const tokenExpire = cookieStore.get("token_expire")?.value;

  const hasToken = Boolean(token);
  const notExpired =
    tokenExpire ? Date.now() < Number(tokenExpire) : false;

  if (hasToken && notExpired) return token!;

  const { access_token, expires_in } = await getAccessToken();
  const expiresAt = Date.now() + Number(expires_in) * 1000;

  cookieStore.set("token", access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  });

  cookieStore.set("token_expire", String(expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  });

  return access_token;
}

function logProxyError(
  stage: string,
  req: NextRequest,
  pathParts: string[],
  error: unknown,
  extra?: Record<string, unknown>
) {
  console.error("[amadeus-proxy] Request failed", {
    stage,
    method: req.method,
    path: `/${pathParts.join("/")}`,
    search: new URL(req.url).search,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...extra,
  });
}

async function forward(req: NextRequest, pathParts: string[], retried = false) {
  const targetUrl = buildTargetUrl(pathParts, req.url);

  try {
    const token = await ensureValidToken();
    const headers = new Headers(req.headers);
    headers.delete("host");

    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const hasBody = !["GET", "HEAD"].includes(req.method);
    const body = hasBody ? await req.text() : undefined;

    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    if (upstreamRes.status === 401 && !retried) {
      const cookieStore = await cookies();
      cookieStore.delete("token");
      cookieStore.delete("token_expire");
      return forward(req, pathParts, true);
    }

    const resText = await upstreamRes.text();
    const contentType =
      upstreamRes.headers.get("content-type") ?? "application/json";

    if (!upstreamRes.ok) {
      console.error("[amadeus-proxy] Upstream request failed", {
        method: req.method,
        targetUrl: targetUrl.toString(),
        status: upstreamRes.status,
        body: resText.slice(0, 500),
      });
    }

    return new NextResponse(resText, {
      status: upstreamRes.status,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    logProxyError("forward", req, pathParts, error, {
      targetUrl: targetUrl.toString(),
      retried,
      apiUrl: getApiUrl(),
    });
    throw error;
  }
}

type Ctx = { params: Promise<{ path: string[] }> };

async function handleRequest(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  try {
    return await forward(req, path);
  } catch (error) {
    logProxyError("handler", req, path, error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, ctx: Ctx) {
  return handleRequest(req, ctx);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return handleRequest(req, ctx);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return handleRequest(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return handleRequest(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return handleRequest(req, ctx);
}
