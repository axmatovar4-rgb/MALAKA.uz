import { auth } from "@/auth";
import type { Role } from "@prisma/client";

export async function requireRole(role: Role) {
  const session = await auth();
  if (!session?.user || session.user.role !== role) {
    throw new Error("Ruxsat yo'q");
  }
  return session.user;
}
