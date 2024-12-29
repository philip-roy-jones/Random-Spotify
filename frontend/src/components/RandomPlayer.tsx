import SpotifyWebApi from "../services/spotifyWebApi.ts";
import {useAuth} from "./AuthProvider.tsx";
import {useEffect, useState, useRef, useLayoutEffect} from "react";
import generateRandomString from "../services/stringService.ts";
import SpotifyWebPlayer from "react-spotify-web-playback";
import Cover from "./Cover.tsx";

type TrackData = {
  artists: { name: string }[],
  durationMs: number,
  id: string,
  image: string,
  name: string,
  uri: string,
};

const RandomPlayer = () => {
  console.log("Rendering RandomPlayer");
  const {accessToken} = useAuth();
  const spotifyWebApi = new SpotifyWebApi(accessToken);
  const [trackUris, setTrackUris] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);

  const fetchRandomTrack = async () => {
    while (true) {
      const randomString = generateRandomString(10);
      const searchResults = await spotifyWebApi.search(randomString, "track", 1);

      if (searchResults.data.tracks.items.length > 0) {
        return searchResults.data.tracks.items[0].uri;
      }
    }
  };

  // For initial search request
  useLayoutEffect(() => {
    const getInitial = async () => {
      const initialTracks = await Promise.all([fetchRandomTrack(), fetchRandomTrack()]);
      setTrackUris(initialTracks);
    };

    getInitial();
  }, []);

  const handleCallback = async () => {
    const newTrack = await fetchRandomTrack();
    setTrackUris((prevUris) => [...prevUris, newTrack]);
  };

  return (
    <main className="h-screen w-screen flex flex-col">
      <Cover currentTrack={currentTrack} />
      <div className={"w-full justify-self-end"}>
        {trackUris.length > 0 && (
          <SpotifyWebPlayer
            token={accessToken}
            uris={trackUris}
            initialVolume={0.1}
            name="Random Spotify Player"
            preloadData={true}
            callback={(state) => {
              console.log(state);
              if (state.track) {
                setCurrentTrack(state.track);
              }
              // if (state.nextTracks.length === 0 && !state.isLoading) {
              //   console.log("No more tracks");
              //   handleCallback();
              // }
            }}
          />
        )}
      </div>
    </main>
  );
};

export default RandomPlayer;