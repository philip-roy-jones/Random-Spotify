import {useEffect, useState} from "react";
import {PlayerTrack} from "../types/PlayerState.ts";

const Cover = () => {
  const [currentTrackState, setCurrentTrackState] = useState<PlayerTrack | null>(null);

  useEffect(() => {
    const handleTrackChange = async (track: PlayerTrack) => {
      setCurrentTrackState(track);
    }



    // cleanup listener
    return () => {

    }
  }, []);

  return (
    <div className="flex justify-center items-center">
      {currentTrackState ? (
        <div>
          <img
            src={currentTrackState.image}
            alt={`${currentTrackState.name} Track Cover`}
            className="h-96 w-96"
          />
          <p className="text-center">{currentTrackState.name}</p>
          <p className="text-center">{currentTrackState.artists.map(artist => artist.name).join(", ")}</p>
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default Cover;