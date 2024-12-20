import SpotifyLoginButton from "../components/SpotifyLoginButton.tsx";
import {useAuth} from "../components/AuthProvider.tsx";

const HomePage = () => {
  const {accessToken} = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen">
      {accessToken ? <p>Logged In</p> : <SpotifyLoginButton/>}
    </div>
  );
};

export default HomePage;