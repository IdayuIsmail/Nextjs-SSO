import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string;
      nric?: string;
    };
    idToken?: string;
  }
  interface User {
    name?: string;
    nric?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name?: string;
    nric?: string;
    idToken?: string;
  }
}
