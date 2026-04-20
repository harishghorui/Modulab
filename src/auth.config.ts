import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl, headers } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/login";

      // Detect host for subdomain restriction
      const hostname = headers.get("host") || "";
      const devDomain = process.env.NODE_ENV === "production" ? "dev.modulab.online" : "dev.localhost:3000";
      const isDevSubdomain = hostname === devDomain;

      // Restrict Admin and Login to the dev subdomain ONLY
      if ((isOnAdmin || isOnLogin) && !isDevSubdomain) {
        return false; // Middleware will handle redirect to dev subdomain
      }

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add empty providers to satisfy NextAuthConfig; we'll add the real ones in auth.ts
} satisfies NextAuthConfig;
