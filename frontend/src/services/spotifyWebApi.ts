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

  async startPlayback(deviceId?: string, contextUri?: string, uris?: string[], offset?: {
    position?: number,
    uri?: string
  }, positionMs?: number): Promise<void> {
    console.log("startPlayback called");

    const url = `${this.baseUrl}/me/player/play${deviceId ? `?device_id=${deviceId}` : ''}`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
    const data: any = {};
    if (contextUri) data.context_uri = contextUri;
    if (uris) data.uris = uris;
    if (offset) data.offset = offset;
    if (positionMs) data.position_ms = positionMs;

    try {
      const response = await axios.put(url, data, { headers });
      console.log("startPlayback response", response);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default SpotifyWebApi;