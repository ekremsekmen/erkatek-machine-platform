import { auth } from "@/lib/auth"
import { NextResponse, type NextRequest } from "next/server"

export default async function proxy(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = await auth()
    const isLoggedIn = !!session?.user
    const isLoginPage = request.nextUrl.pathname === "/admin/giris"

    if (!isLoginPage && !isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/giris", request.url))
    }

    if (isLoginPage && isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
  }

  return NextResponse.next()
}


