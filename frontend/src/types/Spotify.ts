export interface SpotifyTrack {
  artists: { name: string; uri: string }[];
  duration_ms: number;
  id: string;
  album: { images: { url: string }[] };
  name: string;
  uri: string;
}