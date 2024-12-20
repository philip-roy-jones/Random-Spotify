import {useEffect, useContext, createContext, useState} from 'react';
import {useLocation} from 'react-router-dom';
import SpotifyAuthorizationApi from "../services/spotifyAuthorizationApi";

type AuthContextType = {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  refreshToken: string;
  setRefreshToken: (refreshToken: string) => void;
  expiresIn: number;
  setExpiresIn: (expiresIn: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({children}) => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresIn, setExpiresIn] = useState(-1);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('error')) {
      console.error('Error:', error);
      return
    }

    const fetchData = async () => {
      const spotifyAuthorizationApi = new SpotifyAuthorizationApi();
      const response = await spotifyAuthorizationApi.requestAccessToken(params.get('code'), sessionStorage.getItem('codeVerifier') as string);

      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);

      // TODO: handle expiration time

      window.history.replaceState({}, document.title, window.location.pathname);
      sessionStorage.removeItem('state');
    }

    if (params.get('code') && params.get('state') === sessionStorage.getItem('state')) {
      fetchData()
    }

  }, [location]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, refreshToken, setRefreshToken, expiresIn, setExpiresIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// When other pages want to access the auth data, they can use this hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default AuthProvider;