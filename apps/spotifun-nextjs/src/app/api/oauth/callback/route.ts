import {authApi} from "@/shared/api/auth-api";
import {redirectAfterOauthUri} from "@/shared/api/base";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") as string;

  const tokens = await authApi.login({
    code,
    redirectUri: redirectAfterOauthUri,
    accessTokenTTL: '1d',
    rememberMe: true
  })

  const cookieStore = await cookies()

  cookieStore.set({
    name: "refresh-token",
    value: tokens.refreshToken,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 1 day in seconds
    path: "/",
  })
  cookieStore.set({
    name: "access-token",
    value: tokens.accessToken,
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day in seconds
    path: "/",
  })

  return NextResponse.redirect(new URL('/profile', request.url), 307);
}