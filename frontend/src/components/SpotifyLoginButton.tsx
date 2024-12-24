import generateCodeVerifier from 'pkce-challenge';

const SpotifyLoginButton = () => {

  const authorize = (codeChallenge: string): void => {
    const scope = "user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state";
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    sessionStorage.setItem("state", state);

    const params = {
      response_type: "code",
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      scope: scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
      state: state
    }

    authUrl.search = new URLSearchParams(params as Record<string, string>).toString();
    window.location.href = authUrl.toString();
  }

  const handleLogin = async () => {
    const { code_verifier: codeVerifier, code_challenge: codeChallenge } = await generateCodeVerifier();
    sessionStorage.setItem("codeVerifier", codeVerifier);

    authorize(codeChallenge);
  }

  return (
    <>
      <button onClick={handleLogin} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Login with Spotify
      </button>
    </>
  );
};

export default SpotifyLoginButton;