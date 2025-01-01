import {useAuth} from "./AuthProvider.tsx";
import SpotifyWebPlayer, {CallbackState} from "react-spotify-web-playback";
import {PlayerTrack} from "../types/PlayerState.ts";

const RandomPlayer = ({trackUris, currentTrack, setCurrentTrack}: {
  trackUris: string[],
  currentTrack: PlayerTrack | null,
  setCurrentTrack: (track: PlayerTrack) => void
}) => {

  const {accessToken} = useAuth();

  const handleTrackChange = async (state: CallbackState) => {
    if (state.track.id !== currentTrack?.id) {
      setCurrentTrack(state.track);
    }
  }

  return (
    <div className={"w-full justify-self-end"}>
      <SpotifyWebPlayer
        token={accessToken}
        uris={trackUris}
        initialVolume={0.1}
        name="Random Spotify Player"
        preloadData={trackUris.length > 0}
        callback={(state) => {
          if (!state.currentURI) return;

          console.log(state);
          handleTrackChange(state);
        }}
      />
    </div>
  );
};

export default RandomPlayer;