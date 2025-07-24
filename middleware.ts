import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/settings", "/onboarding"]
  const adminRoutes = ["/admin"]
  const authRoutes = ["/auth", "/login", "/signup"]

  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Redirect unauthenticated users to auth page
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth", req.url))
  }

  // Check admin access
  if (isAdminRoute && session) {
    try {
      const { data: profile } = await supabase.from("users").select("plan").eq("id", session.user.id).single()

      if (profile?.plan !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    } catch (error) {
      console.error("Error checking admin access:", error)
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // Check onboarding completion
  if (session && req.nextUrl.pathname.startsWith("/dashboard")) {
    try {
      const { data: profile } = await supabase
        .from("users")
        .select("onboarding_completed")
        .eq("id", session.user.id)
        .single()

      if (!profile?.onboarding_completed) {
        return NextResponse.redirect(new URL("/onboarding", req.url))
      }
    } catch (error) {
      console.error("Error checking onboarding:", error)
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
