import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

const ALLOWED_EMAILS = [process.env.ADMIN_EMAIL ?? ""].filter(Boolean);

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (ALLOWED_EMAILS.length === 0) return true;
      return ALLOWED_EMAILS.includes(user.email ?? "");
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
} satisfies NextAuthConfig;
