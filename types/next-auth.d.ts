import type { Role } from "@prisma/client"

declare module "next-auth" {
  interface User {
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
  }
}

export {}

