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
  } catch(err) {
    return Promise.reject(err)
  }
}

  async refreshAccessToken(refresh_token: string): Promise<axios.AxiosResponse> {
    try {
      console.log('refreshing token');
      return await axios.default.post(this.authUrl, new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: this.clientId
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    } catch(err) {
      return Promise.reject(err);
    }
  }
}

export default SpotifyAuthorizationApi;