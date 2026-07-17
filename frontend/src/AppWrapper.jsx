import { useAuth } from "./context/AuthContext";
import SplashScreen from "./components/SplashScreen";
import App from "./App";

export default function AppWrapper() {
  const { loading } = useAuth();

  return (
    <>
      <SplashScreen isReady={!loading} />
      <App />
    </>
  );
}