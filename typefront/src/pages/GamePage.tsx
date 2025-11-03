import { useParams } from "react-router-dom";
import Game from "../components/game_comp/Game";
export default function GamePage() {
  const { id } = useParams();

  return (
      <div className="flex flex-col items-center min-h-screen bg-(--color-home-bg) text-(--color-text)">
          <Game songId={Number(id)} />
        </div>
  );
}