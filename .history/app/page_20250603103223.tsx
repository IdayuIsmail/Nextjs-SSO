'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="mb-4 text-lg">You are not signed in</p>
        <button
          onClick={() => signIn('mydigitalid', { callbackUrl: '/' })}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign in with MyDigitalID
        </button>
      </div>
    );
  }

  if(session) 
    
  const handleLogout = async () => {
  const idToken = session.idToken;
  const baseUrl = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL;
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
  const client_id = process.env.KEYCLOAK_CLIENT_ID;
  const redirectUri = window.location.origin;

  if (!baseUrl || !realm) {
    console.error("Missing Keycloak logout URL or realm");
    return;
  }

  try {
    const logoutUrl = new URL(`${baseUrl}/realms/${realm}/protocol/openid-connect/logout`);
    if (client_id) logoutUrl.searchParams.set("client_id", client_id);
    if (idToken) logoutUrl.searchParams.set("id_token_hint", idToken);
    logoutUrl.searchParams.set("post_logout_redirect_uri", redirectUri);

    await signOut({ redirect: false });
    window.location.href = logoutUrl.toString();
  } catch (error) {
    console.error("Failed to construct logout URL", error);
  }
};


return (
  <div className="h-screen flex flex-col items-center justify-center text-center">
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-2">Welcome, {session.user?.nama}</h2>
      <p className="text-gray-700 dark:text-gray-300 text-lg">
        IC Number: {session.user?.icNumber}
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  </div>
);

}
