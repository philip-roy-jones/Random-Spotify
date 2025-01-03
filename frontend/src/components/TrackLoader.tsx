// src/components/TrackLoader.tsx
import {useState, useLayoutEffect, useRef} from "react";
import SpotifyWebApi from "../services/spotifyWebApi.ts";
import {useAuth} from "./AuthProvider.tsx";
import RandomPlayer from "./RandomPlayer.tsx";
import Cover from "./Cover.tsx";
import generateRandomString from "../services/stringService.ts";
import {PlayerArtist, PlayerTrack} from "../types/PlayerState.ts";
import {SpotifyTrack} from "../types/Spotify.ts";
import {measureExecutionTime} from "../utils/performanceUtils.ts";
import {enqueue, dequeue, getQueueLength} from "../utils/queueUtils.ts";

const TrackLoader = () => {
  const {accessToken} = useAuth();
  const [trackQueue, setTrackQueue] = useState<Map<string, SpotifyTrack>>(new Map());
  const [offset, setOffset] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null);
  const hasFetchedInitialTracks = useRef(false);

  const preloadedTracksQueueName = "preloadedTracks";

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
    const newTrackCount = mergeTrackMaps(trackQueue, nextTracks);

    preloadNextTracks();    // Keep async so it doesn't block the UI

    setOffset(trackQueue.size - newTrackCount);
    setTrackQueue(trackQueue);
  }

  useLayoutEffect(() => {
    const getInitialTrack = async () => {
      const initialTracks = await fetchMultipleRandomTracks(5);

      initialTracks.forEach((track, key) => {
        if (key === initialTracks.keys().next().value) setCurrentTrack(convertToPlayerTrack(track));
        trackQueue.set(track.uri, track);
      })

      setTrackQueue(trackQueue);
    };
    if (hasFetchedInitialTracks.current) return;
    hasFetchedInitialTracks.current = true;

    getInitialTrack();
    preloadNextTracks()
  }, []);

  return (
    <main className="h-screen w-screen flex flex-col">
      <Cover currentTrack={currentTrack}/>
      <RandomPlayer trackQueue={trackQueue} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack}
                    addTracksToQueue={addTracksToQueue} offset={offset}/>
    </main>
  );
};

export default TrackLoader;