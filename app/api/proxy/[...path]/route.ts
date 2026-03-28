import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken } from "@/utils/auth";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

function buildTargetUrl(pathParts: string[], reqUrl: string) {
  const incoming = new URL(reqUrl);
  const target = new URL(`${API_URL}/${pathParts.join("/")}`);
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

async function forward(req: NextRequest, pathParts: string[], retried = false) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "API_URL is missing" },
      { status: 500 }
    );
  }

  const token = await ensureValidToken();
  const targetUrl = buildTargetUrl(pathParts, req.url);

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

  return new NextResponse(resText, {
    status: upstreamRes.status,
    headers: { "Content-Type": contentType },
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
