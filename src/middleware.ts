import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN, deleteUserToken } from "./utils/get-token";
import { API_ENDPOINTS } from "./api/endpoints";
import api from "./api";

const Public_Routes = [
  "/auth/login",
  "/auth/verify-otp",
  "/auth/forget-password",
  "/auth/register",
];

export async function middleware(request: NextRequest) {
  const isToken = request.cookies.has(AUTH_TOKEN);
  const url = request.url;
  const path = request.nextUrl.pathname;

  if (Public_Routes.includes(path) && isToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (url.includes("auth") && !isToken) {
    return NextResponse.next();
  }

  if (!isToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // const token = request.cookies.get(AUTH_TOKEN)?.value;
  // try {
  //   const {data} = await api.get(`${API_ENDPOINTS.USER}`, { headers: { Authorization: `Bearer ${token}`} });
  //   if (!data) {
  //     deleteUserToken();
  //     return NextResponse.redirect(new URL("/auth/login", request.url));
  //   }
  //   return NextResponse.next();
  // } catch (error) {
  //   console.error("Error validating token", error);
  //   deleteUserToken();
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
