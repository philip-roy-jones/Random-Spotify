import {PlayerTrack} from "../types/PlayerState.ts";

const Cover = ({currentTrack}: {currentTrack: PlayerTrack | null}) => {

  return (
    <div className="flex justify-center items-center">
      {currentTrack && (
        <div>
          <img
            src={currentTrack.image}
            alt={`${currentTrack.name} Track Cover`}
            className="h-96 w-96"
          />
          <p className="text-center">{currentTrack.name}</p>
          <p className="text-center">{currentTrack.artists.map(artist => artist.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default Cover;