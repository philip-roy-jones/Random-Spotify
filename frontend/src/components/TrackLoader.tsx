// src/components/TrackLoader.tsx
import {useState, useLayoutEffect, useRef} from "react";
import SpotifyWebApi from "../services/spotifyWebApi.ts";
import {useAuth} from "./AuthProvider.tsx";
import RandomPlayer from "./RandomPlayer.tsx";
import Cover from "./Cover.tsx";
import generateRandomString from "../services/stringService.ts";
import {PlayerArtist, PlayerTrack} from "../types/PlayerState.ts";
import {SpotifyTrack} from "../types/Spotify.ts";

const TrackLoader = () => {
  const {accessToken} = useAuth();
  const [trackUris, setTrackUris] = useState<string[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null);
  const hasFetchedInitialTracks = useRef(false);

  const fetchRandomTrack = async () => {
    const spotifyWebApi = new SpotifyWebApi(accessToken);
    while (true) {
      const randomString = generateRandomString(10);
      const searchResults = await spotifyWebApi.search(randomString, "track", 1);

      if (searchResults.data.tracks.items.length > 0) {
        return searchResults.data.tracks.items[0];
      } else {
        console.log("No results found for: ", randomString);
      }
    }
  };

  const convertToPlayerTrack = (data: SpotifyTrack): PlayerTrack => {
    return {
      artists: data.artists.map((artist: PlayerArtist) => ({name: artist.name, uri: artist.uri})),
      durationMs: data.duration_ms,
      id: data.id,
      image: data.album.images[0].url,
      name: data.name,
      uri: data.uri
    }
  }

  const addTracksToQueue = async () => {
    const newTracks = await Promise.all([fetchRandomTrack(), fetchRandomTrack(), fetchRandomTrack(), fetchRandomTrack(), fetchRandomTrack()]);
    const newTrackUris = newTracks.map(track => track.uri);

    const combinedTrackUris = [...trackUris, ...newTrackUris];
    setOffset(trackUris.length);
    setTrackUris(combinedTrackUris);
  }

  useLayoutEffect(() => {
    const getInitialTrack = async () => {
      const initialTracks = await Promise.all([fetchRandomTrack(), fetchRandomTrack(), fetchRandomTrack(), fetchRandomTrack(), fetchRandomTrack()]);
      const initialTrackUris = initialTracks.map(track => track.uri);
      console.log("Initial Tracks URIs: ", initialTrackUris);
      console.log("Access Token: ", accessToken);
      setTrackUris(initialTrackUris);
      setCurrentTrack(convertToPlayerTrack(initialTracks[0]));
    };
    if (hasFetchedInitialTracks.current) return;
    hasFetchedInitialTracks.current = true;

    getInitialTrack();
  }, []);

  return (
    <main className="h-screen w-screen flex flex-col">
      <Cover currentTrack={currentTrack}/>
      <RandomPlayer trackUris={trackUris} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack}
                    addTracksToQueue={addTracksToQueue} offset={offset}/>
    </main>
  );
};

export default TrackLoader;