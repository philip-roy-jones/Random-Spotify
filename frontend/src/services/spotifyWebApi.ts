import * as axios from "axios";

class SpotifyWebApi {
  private baseUrl: string;
  private accessToken: string;

  constructor(accessToken: string) {
    this.baseUrl = "https://api.spotify.com/v1";
    this.accessToken = accessToken;
  }

  async search(query: string, type: string, limit: number): Promise<axios.AxiosResponse> {
    try {
      return await axios.default.get(`${this.baseUrl}/search`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        },
        params: {
          q: encodeURIComponent(query),
          type: type,
          limit: limit
        }
      });
    } catch(err) {
      return Promise.reject(err);
    }
  }
}

export default SpotifyWebApi;