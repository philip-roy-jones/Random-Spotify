export type PlayerState = {
  currentDeviceId: string;
  currentURI: string;
  deviceId: string;
  devices: Device[];
  error: string;
  errorType: string | null;
  isActive: boolean;
  isInitializing: boolean;
  isMagnified: boolean;
  isPlaying: boolean;
  isSaved: boolean;
  isUnsupported: boolean;
  needsUpdate: boolean;
  nextTracks: PlayerTrack[];
  playerPosition: string;
  position: number;
  previousTracks: PlayerTrack[];
  progressMs: number;
  repeat: string;
  shuffle: boolean;
  status: string;
  track: PlayerTrack;
  volume: number;
  type: string;
};

export type Device = {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  supports_volume: boolean;
  type: string;
  volume_percent: number;
};

export type PlayerTrack = {
  artists: PlayerArtist[];
  durationMs: number;
  id: string;
  image: string;
  name: string;
  uri: string;
};

export type PlayerArtist = {
  name: string;
  uri: string;
};