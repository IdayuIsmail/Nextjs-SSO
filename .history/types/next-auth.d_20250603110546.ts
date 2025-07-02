import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      nama?: string;
      icNumber?: string;
    };
    idToken?: string;
  }
  interface User {
    nama?: string;
    icNumber?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    nama?: string;
    icNumber?: string;
    idToken?: string;
  }
}
