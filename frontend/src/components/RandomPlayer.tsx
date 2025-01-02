import {useAuth} from "./AuthProvider.tsx";
import SpotifyWebPlayer, {CallbackState} from "react-spotify-web-playback";
import {PlayerTrack} from "../types/PlayerState.ts";

const RandomPlayer = ({trackUris, currentTrack, setCurrentTrack, addTracksToQueue, offset}: {
  trackUris: string[],
  currentTrack: PlayerTrack | null,
  setCurrentTrack: (track: PlayerTrack) => void,
  addTracksToQueue: () => void,
  offset: number
}) => {

  const {accessToken} = useAuth();

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
        key={trackUris.join("")}
        token={accessToken}
        uris={trackUris}
        initialVolume={0.1}
        name="Random Spotify Player"
        syncExternalDeviceInterval={3}
        offset={offset}
        play={offset !== 0}
        preloadData={trackUris.length > 0}
        callback={(state) => {
          handleTrackChange(state);
          handleEnd(state);
        }}
      />
    </div>
  );
};

export default RandomPlayer;