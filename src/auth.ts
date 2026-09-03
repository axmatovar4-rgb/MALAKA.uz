import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { consumeOtp } from "@/lib/otp";
import { isLoginLocked, recordFailedLogin } from "@/lib/login-rate-limit";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    institutionId: string | null;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string | null;
      role: Role;
      institutionId: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    institutionId: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parol", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        if (await isLoginLocked(email)) {
          throw new Error(
            "Juda ko'p noto'g'ri urinish. 15 daqiqadan so'ng qaytadan urinib ko'ring.",
          );
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
          await recordFailedLogin(email);
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          await recordFailedLogin(email);
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: user.institutionId,
        };
      },
    }),
    Credentials({
      id: "phone-otp",
      credentials: {
        phone: { label: "Telefon", type: "text" },
        code: { label: "Kod", type: "text" },
      },
      authorize: async (credentials) => {
        const phone = credentials?.phone as string | undefined;
        const code = credentials?.code as string | undefined;
        if (!phone || !code) return null;

        const ok = await consumeOtp(phone, code);
        if (!ok) return null;

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: user.institutionId,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.institutionId = user.institutionId;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.institutionId = token.institutionId;
      return session;
    },
  },
});
