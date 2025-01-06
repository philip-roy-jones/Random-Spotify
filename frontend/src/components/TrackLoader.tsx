import {useLayoutEffect, useRef, useState} from "react";
import SpotifyWebApi from "../services/spotifyWebApi.ts";
import {useAuth} from "./AuthProvider.tsx";
import RandomPlayer from "./RandomPlayer.tsx";
import Cover from "./Cover.tsx";
import generateRandomString from "../services/stringService.ts";
import {PlayerTrack} from "../types/PlayerState.ts";
import {SpotifyTrack} from "../types/Spotify.ts";
import {enqueue, dequeue, getQueueLength} from "../utils/queueUtils.ts";
import {spotifyApi, SpotifyPlayOptions} from "react-spotify-web-playback";

const TrackLoader = () => {
  const {accessToken} = useAuth();
  const trackQueue = useRef<Map<string, SpotifyTrack>>(new Map());
  const offset = useRef<number>(0);
  const currentTrackRef = useRef<PlayerTrack | null>(null);
  const hasFetchedInitialTracks = useRef(false);
  const preloadedTracksQueueName = "preloadedTracks";
  const [, setInitialTracksLoaded] = useState(false);

  const fetchRandomTrack = async (): Promise<SpotifyTrack> => {
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

  const fetchMultipleRandomTracks = async (limit: number): Promise<Map<string, SpotifyTrack>> => {
    const uniqueTracks = new Map<string, SpotifyTrack>();

    while (uniqueTracks.size < limit) {
      const trackPromises = Array.from({length: limit - uniqueTracks.size}, () => fetchRandomTrack());
      const tempTrackQueue = await Promise.all(trackPromises);
      tempTrackQueue.forEach(track => uniqueTracks.set(track.uri, track));
    }

    return uniqueTracks;
  };

  // Merge two maps, return the number of new tracks added
  const mergeTrackMaps = (map1: Map<string, SpotifyTrack>, map2: Map<string, SpotifyTrack>): number => {
    let mergedCount = 0;
    map2.forEach((value, key) => {
      if (!map1.has(key)) {
        map1.set(key, value);
        mergedCount++;
      }
    });
    return mergedCount;
  }

  /*
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
   */
  const preloadNextTracks = async () => {
    const maxNumberOfMapsInQueue = 2;
    if (getQueueLength(preloadedTracksQueueName) >= maxNumberOfMapsInQueue) return;

    const numberOfTracksInAMap = 5;
    const newTracks = await fetchMultipleRandomTracks(numberOfTracksInAMap);
    const stringifiedNewTracks = JSON.stringify(Array.from(newTracks.entries()));
    enqueue(preloadedTracksQueueName, stringifiedNewTracks);
  }

  const loadNextTracks = () => {
    const preloadedTracksAsString = dequeue<string>(preloadedTracksQueueName);
    return new Map<string, SpotifyTrack>(JSON.parse(preloadedTracksAsString || "[]"));
  }

  const addTracksToQueue = async () => {
    const nextTracks: Map<string, SpotifyTrack> = loadNextTracks() as Map<string, SpotifyTrack>;
    const newTrackCount = mergeTrackMaps(trackQueue.current, nextTracks);

    preloadNextTracks();    // Keep async so it doesn't block the UI

    offset.current = trackQueue.current.size - newTrackCount;

    const currentDevice = sessionStorage.getItem('rswpDeviceId');

    if (currentDevice) {
      const playOptions: SpotifyPlayOptions = {
        uris: Array.from(trackQueue.current.keys()),
        offset: offset.current,
        deviceId: currentDevice
      };
      spotifyApi.play(accessToken, playOptions);
    } else {
      console.error("No device found");
    }

  }

  useLayoutEffect(() => {
    const getInitialTrack = async () => {
      const initialTracks = await fetchMultipleRandomTracks(5);

      initialTracks.forEach((track) => {
        // if (key === initialTracks.keys().next().value) setCurrentTrackState(convertToPlayerTrack(track));
        trackQueue.current.set(track.uri, track);
      })

      setInitialTracksLoaded(true);
    };
    if (hasFetchedInitialTracks.current) return;    // For react strict mode, double rendering
    hasFetchedInitialTracks.current = true;

    getInitialTrack();
    preloadNextTracks()
  }, []);

  return (
    <main className="h-screen w-screen flex flex-col">
      <Cover/>
      <RandomPlayer trackQueue={trackQueue} currentTrackRef={currentTrackRef}
                    addTracksToQueue={addTracksToQueue} offset={offset}/>
    </main>
  );
};

export default TrackLoader;