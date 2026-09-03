import { auth } from "@/auth";
import { NextResponse } from "next/server";

const roleHome: Record<string, string> = {
  ADMIN: "/admin",
  DIRECTOR: "/director",
  TEACHER: "/teacher",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname === "/login") {
    if (user) {
      return NextResponse.redirect(new URL(roleHome[user.role], req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (user) {
      return NextResponse.redirect(new URL(roleHome[user.role], req.url));
    }
    return NextResponse.next();
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const section = "/" + pathname.split("/")[1];
  const protectedSections = new Set(Object.values(roleHome));
  if (protectedSections.has(section) && section !== roleHome[user.role]) {
    return NextResponse.redirect(new URL(roleHome[user.role], req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)",
  ],
};
