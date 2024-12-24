import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

type SpotifyPlayerContextType = {
  player: Spotify.Player | null;
  isPlaying: boolean;
  togglePlay: () => void;
};

const SpotifyPlayerContext = createContext<SpotifyPlayerContextType | undefined>(undefined);

export const SpotifyPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const {accessToken} = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = accessToken;
      const player = new Spotify.Player({
        name: 'Random Spotify',
        getOAuthToken: (cb: (token: string) => void) => { cb(token); },
        volume: 0.5
      });

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state: Spotify.PlaybackState) => {
        setIsPlaying(!state.paused);
      });

      player.connect();
      setPlayer(player);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const togglePlay = () => {
    if (player) {
      player.togglePlay();
    }
  };

  return (
    <SpotifyPlayerContext.Provider value={{ player, isPlaying, togglePlay }}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};

export const useSpotifyPlayer = () => {
  const context = useContext(SpotifyPlayerContext);
  if (context === undefined) {
    throw new Error('useSpotifyPlayer must be used within a SpotifyPlayerProvider');
  }
  return context;
};