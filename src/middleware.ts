/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authKey } from "@/constant/authkey";
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AuthRoutes = ["/"];
const publicRoutes = ["/", "/api/auth/login", "/api/auth/refresh-token"];

const roleBasedPrivateRoutes = {
  admin: [/^\/dashboard(\/.*)?$/],
  super_admin: [/^\/dashboard(\/.*)?$/],
  editor: [/^\/dashboard(\/.*)?$/],
};

type Role = keyof typeof roleBasedPrivateRoutes;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for:
  // 1. API routes
  // 2. Static files (json, images, etc.)
  // 3. _next static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.match(/\.(json|jpg|jpeg|png|gif|ico|svg|css|js)$/) ||
    pathname === '/data/location.json' || // Explicitly allow location.json
    publicRoutes.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(authKey)?.value ?? null;
  
  if (!accessToken) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  let decodedData = null;
  try {
    decodedData = jwtDecode(accessToken) as any;
  } catch (error) {
    // Clear invalid token
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete(authKey);
    return response;
  }

  const role = decodedData?.role as Role;

  if (role && roleBasedPrivateRoutes[role]) {
    const routes = roleBasedPrivateRoutes[role];
    if (routes.some((route) => route.test(pathname))) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    // Match all pages except static files
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};


// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { authKey } from "@/constant/authkey";
// import { jwtDecode } from "jwt-decode";

// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// const AuthRoutes = ["/"];

// const roleBasedPrivateRoutes = {
//   admin: [/^\/dashboard(\/.*)?$/],
//   super_admin: [/^\/dashboard(\/.*)?$/],
//   editor: [/^\/dashboard(\/.*)?$/],

// };

// type Role = keyof typeof roleBasedPrivateRoutes;

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const accessToken = request.cookies.get(authKey)?.value ?? null;
//   if (!accessToken) {
//     if (AuthRoutes.includes(pathname)) {
//       return NextResponse.next();
//     } else {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   let decodedData = null;
//   try {
//     decodedData = jwtDecode(accessToken) as any;
//   } catch (error) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   const role = decodedData?.role as Role;

//   if (role && roleBasedPrivateRoutes[role]) {
//     const routes = roleBasedPrivateRoutes[role];
//     if (routes.some((route) => route.test(pathname))) {
//       return NextResponse.next();
//     }
//   }

//   return NextResponse.redirect(new URL("/", request.url));
// }

// export const config = {
//   matcher: ["/login", "/register", "/profile/:path*", "/dashboard/:path*"],
// };
