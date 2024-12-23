import SpotifyLoginButton from "../components/SpotifyLoginButton.tsx";
import {useAuth} from "../components/AuthProvider.tsx";
import RandomPlayer from "../components/RandomPlayer.tsx";

const HomePage = () => {
  const {accessToken} = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen">
      {accessToken ? <RandomPlayer /> : <SpotifyLoginButton/>}
    </div>
  );
};

export default HomePage;