import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export function proxy(request: any) {
  return auth(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
