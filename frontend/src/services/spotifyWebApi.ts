import axios, {AxiosResponse} from "axios";

class SpotifyWebApi {
  private baseUrl: string;
  private accessToken: string;

  constructor(accessToken: string) {
    this.baseUrl = "https://api.spotify.com/v1";
    this.accessToken = accessToken;
  }

  async search(query: string, type: string, limit: number): Promise<AxiosResponse> {
    console.log("Searching for: ", query);
    const encodedQuery = encodeURIComponent(query);

    try {
      return await axios.get(`${this.baseUrl}/search`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        },
        params: {
          q: encodedQuery,
          type: type,
          limit: limit
        }
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default SpotifyWebApi;