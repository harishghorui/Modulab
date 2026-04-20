import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const SYSTEM_ROUTES = ["/admin", "/api", "/login", "/register", "/dashboard"];
const STATIC_ASSETS = [".png", ".jpg", ".jpeg", ".svg", ".css", ".js", ".ico", ".webp", ".map"];

export default auth(async function middleware(req) {
  const url = req.nextUrl;
  let path = url.pathname;

  // 1. Static Asset Performance - Return immediately to skip domain/auth logic
  if (STATIC_ASSETS.some((ext) => path.toLowerCase().endsWith(ext))) {
    return NextResponse.next();
  }

  // 2. Path Normalization - Remove trailing slashes (except for root)
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  const hostname = req.headers.get("host") || "";
  const isLoggedIn = !!req.auth;
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  // Define domains
  const rootDomain = process.env.NODE_ENV === "production" ? "modulab.online" : "localhost:3000";
  const devDomain = process.env.NODE_ENV === "production" ? "dev.modulab.online" : "dev.localhost:3000";

  const isRootDomain = hostname === rootDomain || (hostname.includes("modulab") && !hostname.includes("dev."));
  const isDevSubdomain = hostname === devDomain || hostname.includes("dev.modulab");

  // 3. Auth Redirection - Redirect logged-in users away from login/register
  if (isDevSubdomain && isLoggedIn && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 4. System Priority - Handle restricted routes and system bypass
  if (SYSTEM_ROUTES.some((route) => path.startsWith(route))) {
    // If on root domain and trying to access restricted system routes, redirect to dev subdomain
    if (isRootDomain) {
      const restrictedPaths = ["/admin", "/login", "/register", "/dashboard"];
      if (restrictedPaths.some((p) => path.startsWith(p))) {
        const redirectUrl = new URL(path, `${protocol}://${devDomain}`);
        return NextResponse.redirect(redirectUrl);
      }
    }
    return NextResponse.next();
  }

  // 5. Dev Subdomain Strategy (Portfolio Product)
  if (isDevSubdomain) {
    // Rewrite root of subdomain to /portfolio
    if (path === "/") {
      return NextResponse.rewrite(new URL("/portfolio", req.url));
    }

    // Rewrite all other non-system, non-static paths to /portfolio/[username]
    return NextResponse.rewrite(new URL(`/portfolio${path}`, req.url));
  }

  // 6. Root Domain Strategy (Platform Brand)
  if (isRootDomain) {
    // Rewrite root to /platform
    if (path === "/") {
      return NextResponse.rewrite(new URL("/platform", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
