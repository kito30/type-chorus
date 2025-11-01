import VideoCard from "../components/game_comp/VideoCard";
import { useLocation, useParams } from "react-router-dom";
import Game from "../components/game_comp/Game";

export default function GamePage() {
  const location = useLocation();
  const { id } = useParams();
  const videoId = location.state?.videoId || "e1pZIfretEs"; // Fallback to default

  return (
    <div className="flex flex-col items-center h-screen bg-(--color-home-bg) text-(--color-text) gap-10">
        <div className="flex flex-col items-center w-full max-w-2xl pt-[5%]">
                <VideoCard videoId={videoId} />
        </div>
        <div>
          <Game id={Number(id)} />
        </div>
    </div>
  );
}