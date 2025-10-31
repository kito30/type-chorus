import VideoCard from "../components/game_comp/VideoCard";

export default function GamePage() {
  return (
    <div className="flex flex-col items-center h-screen bg-(--color-home-bg) text-(--color-text)">
        <div className="flex flex-col items-center w-full max-w-2xl pt-[5%]">
                <VideoCard videoId="e1pZIfretEs" />
        </div>
    </div>
  );
}