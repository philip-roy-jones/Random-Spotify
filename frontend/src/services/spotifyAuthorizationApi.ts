import * as axios from "axios";

class SpotifyAuthorizationApi {
  private clientId: string;
  private authUrl: string;

  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    this.authUrl = "https://accounts.spotify.com/api/token";
  }

  async requestAccessToken(code: string, codeVerifier: string): Promise<axios.AxiosResponse> {
  try {
    return await axios.default.post(this.authUrl, new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
      client_id: this.clientId,
      code_verifier: codeVerifier
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  } catch {
    return
  }
}

  async refreshAccessToken(refresh_token: string): Promise<void> {
    console.log("refresh token", refresh_token);
  }
}

export default SpotifyAuthorizationApi;