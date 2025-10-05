import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                if (pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/api/trpc") ||  // Allow tRPC routes
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname === "/" ||
                    pathname.startsWith("/api/trpc") ||      // Allow tRPC API routes
                    pathname.startsWith("/api/video")        // Allow video streaming
                ) {
                    return true;
                }

                return !!token;
            }
        }
    }
);

export const config = {
    matcher:["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
}