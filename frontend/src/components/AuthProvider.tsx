import {useEffect, useContext, createContext, useState, useRef} from 'react';
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

const AuthProvider = ({children}: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);
  const location = useLocation();
  const hasFetchedTokensRef = useRef(false);

  // For Initial Login
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (!params.get('code')) return;    // When user first loads the page, there is no code in the URL

    if (params.get('error')) {
      console.error('Error:', params.get('error'));
      return
    }

    const fetchData = async () => {
      hasFetchedTokensRef.current = true;   // This has to be set before the fetch request because if response is 400, it won't be set to true

      const spotifyAuthorizationApi = new SpotifyAuthorizationApi();
      const response = await spotifyAuthorizationApi.requestAccessToken(params.get('code') as string, sessionStorage.getItem('codeVerifier') as string);

      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);
      setExpiresIn(response.data.expires_in);

      window.history.replaceState({}, document.title, window.location.pathname);
      sessionStorage.removeItem('state');
    }

    if (params.get('code') && params.get('state') === sessionStorage.getItem('state') && !hasFetchedTokensRef.current) {
      fetchData()
    }

  }, []);

  // For Refreshing Token
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(async () => {
      const spotifyAuthorizationApi = new SpotifyAuthorizationApi();
      try {
        const response = await spotifyAuthorizationApi.refreshAccessToken(refreshToken);

        setAccessToken(response.data.access_token);
        setExpiresIn(response.data.expires_in);
        if (response.data.refresh_token) {
          setRefreshToken(response.data.refresh_token);
        }
      } catch (err) {
        console.error("There was an error :( ", err);
      }
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return (
    <AuthContext.Provider value={{accessToken, setAccessToken, refreshToken, setRefreshToken, expiresIn, setExpiresIn}}>
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