import {useAuth} from "./AuthProvider.tsx";
import SpotifyPlayer, {CallbackState} from "react-spotify-web-playback";
import {PlayerTrack} from "../types/PlayerState.ts";
import {SpotifyTrack} from "../types/Spotify.ts";

const RandomPlayer = ({trackQueue, currentTrackRef, addTracksToQueue, offset}: {
  trackQueue: React.MutableRefObject<Map<string, SpotifyTrack>>,
  currentTrackRef: React.MutableRefObject<PlayerTrack | null>,
  addTracksToQueue: () => void,
  offset: React.MutableRefObject<number>
}) => {

  const {accessToken} = useAuth();
  console.log("Rendering RandomPlayer");
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
    if (state.track.id !== currentTrackRef.current?.id) {
      // console.log("track should change");
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
      <SpotifyPlayer
        key={Array.from(trackQueue.current.keys()).join("")}
        token={accessToken}
        uris={Array.from(trackQueue.current.keys())}
        initialVolume={0.1}
        name="Random Spotify Player"
        persistDeviceSelection={true}
        magnifySliderOnHover={true}
        showSaveIcon={true}
        syncExternalDevice={true}
        syncExternalDeviceInterval={3}
        offset={offset.current}
        preloadData={trackQueue.current.size > 0}
        callback={(state) => {
          // console.log(state);
          handleTrackChange(state);
          handleEnd(state);
        }}
      />
    </div>
  );
};

export default RandomPlayer;