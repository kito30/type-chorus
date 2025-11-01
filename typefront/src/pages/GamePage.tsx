import VideoCard from "../components/game_comp/VideoCard";
import { useLocation } from "react-router-dom";

export default function GamePage() {
  const location = useLocation();
  const videoId = location.state?.videoId || "e1pZIfretEs"; // Fallback to default

  return (
    <div className="flex flex-col items-center h-screen bg-(--color-home-bg) text-(--color-text)">
        <div className="flex flex-col items-center w-full max-w-2xl pt-[5%]">
                <VideoCard videoId={videoId} />
        </div>
    </div>
  );
}