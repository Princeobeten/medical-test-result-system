import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "technologist";
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    role: "admin" | "technologist";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "technologist";
  }
}
