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
      issuer: `${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}`,
      authorization: {
        url: `${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/
        ${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/auth`,
        params: {
          scope: "openid profile",
          prompt: "login",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, useerInfo }: { token: JWT; account?: Account | null; userInfo:  }): Promise<JWT> {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;

        const res = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/
          {process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`, {
          headers: { Authorization: `Bearer ${account.access_token}` },
        });

        const userInfo = await res.json();
        if(userInfo) console.log('useInfo,', userInfo as string);
        token.nama = userInfo.nama || userInfo.fullname;
        token.icNumber = userInfo.nric;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if(token) console.log('useInfo,', token);
      session.user.nama = token.nama as string;
      session.user.icNumber = token.icNumber as string;
      session.idToken = token.idToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
