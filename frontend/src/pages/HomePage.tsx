import LoginButton from "../components/LoginButton.tsx";
import {useAuth} from "../components/AuthProvider.tsx";
import TrackLoader from "../components/TrackLoader.tsx";

const HomePage = () => {
  const {accessToken} = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen">
      {accessToken ? <TrackLoader /> : <LoginButton/>}
    </div>
  );
};

export default HomePage;