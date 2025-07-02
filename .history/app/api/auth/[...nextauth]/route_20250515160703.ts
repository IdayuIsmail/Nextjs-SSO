//app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";
import { Account, Session } from "next-auth";

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      id: "mydigitalid",
      name: "MyDigitalID",
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}`,
      authorization: {
        url: `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
        params: {
          scope: "openid profile",
          prompt: "login",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: Account | null }): Promise<JWT> {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;

        const res = await fetch(`${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`, {
          headers: { Authorization: `Bearer ${account.access_token}` },
        });

        const userInfo = await res.json();
        token.nama = userInfo.nama || userInfo.fullname;
        token.icNumber = userInfo.nric;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      session.user.nama = token.nama as string;
      session.user.icNumber = token.icNumber as string;
      session.idToken = token.idToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
