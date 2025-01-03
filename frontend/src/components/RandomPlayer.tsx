import {useAuth} from "./AuthProvider.tsx";
import SpotifyWebPlayer, {CallbackState} from "react-spotify-web-playback";
import {PlayerTrack} from "../types/PlayerState.ts";
import {SpotifyTrack} from "../types/Spotify.ts";

const RandomPlayer = ({trackQueue, currentTrack, setCurrentTrack, addTracksToQueue, offset}: {
  trackQueue: Map<string, SpotifyTrack>,
  currentTrack: PlayerTrack | null,
  setCurrentTrack: (track: PlayerTrack) => void,
  addTracksToQueue: () => void,
  offset: number
}) => {

  const {accessToken} = useAuth();

  // For development purposes, log the time it takes for the player to initialize
  /*
  const renderStartTime = useRef<number>(0);
  const emptyPlayerRenderToReadyTime = useRef<number>(0);
  const fullPlayerRenderToReadyTime = useRef<number>(0);
  useEffect(() => {
    renderStartTime.current = performance.now();
  }, []);
  const getInitializationTime = async (state: CallbackState) => {
    if (state.status === "INITIALIZING" && state.type === 'status_update' && renderStartTime.current !== null) {
      const initializationTime = performance.now();
      emptyPlayerRenderToReadyTime.current = initializationTime - renderStartTime.current;
      console.log(`The empty player took ${emptyPlayerRenderToReadyTime.current} milliseconds`);
    }

    if (state.status === "READY" && state.type === 'preload_update' && renderStartTime.current !== null) {
      const initializationTime = performance.now();
      fullPlayerRenderToReadyTime.current = initializationTime - emptyPlayerRenderToReadyTime.current;
      console.log(`Preload Update took ${fullPlayerRenderToReadyTime.current} milliseconds`);
    }

    console.log(`Initialization process took ${fullPlayerRenderToReadyTime.current + emptyPlayerRenderToReadyTime.current} milliseconds`);
  }
*/
  const handleTrackChange = async (state: CallbackState) => {
    if (state.track.id !== currentTrack?.id) {
      setCurrentTrack(state.track);
    }
  }

  const handleEnd = async (state: CallbackState) => {
    if (!state.currentURI) return;

    if (state.type === "track_update" && !state.isPlaying) {
      addTracksToQueue();
    }
  }

  return (
    <div className={"w-full justify-self-end"}>
      <SpotifyWebPlayer
        key={Array.from(trackQueue.keys()).join("")}
        token={accessToken}
        uris={Array.from(trackQueue.keys())}
        initialVolume={0.1}
        name="Random Spotify Player"
        syncExternalDeviceInterval={3}
        offset={offset}
        play={offset !== 0}
        preloadData={trackQueue.size > 0}
        callback={(state) => {
          console.log(state);
          handleTrackChange(state);
          handleEnd(state);
        }}
      />
    </div>
  );
};

export default RandomPlayer;