import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      nama?: string;
      nric?: string;
    };
    idToken?: string;
  }
  interface User {
    nama?: string;
    nric?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    nama?: string;
    nric?: string;
    idToken?: string;
  }
}
