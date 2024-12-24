import RandomPlayerControlBar from "./RandomPlayerControlBar.tsx";
import randomStringGenerator from "../services/randomStringGenerator.ts";
import SpotifyWebApi from "../services/spotifyWebApi.ts";
import {useAuth} from "./AuthProvider.tsx";
import {useEffect} from "react";

const RandomPlayer = () => {
  const {accessToken} = useAuth();
  const randomString = randomStringGenerator(10);
  const spotifyWebApi = new SpotifyWebApi(accessToken);

  // For initial search request
  useEffect(() => {
    const makeSearchRequest = async () => {
      return await spotifyWebApi.search(randomString, 'track', 1);
    };

    const fetchResults = async () => {
      const results = await makeSearchRequest();
      console.log(results);
    };
    fetchResults();
  }, []);

  return (
    <main className="h-screen w-screen">
      <RandomPlayerControlBar/>
    </main>
  );
};

export default RandomPlayer;