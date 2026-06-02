import { appwriteStorage } from "@/appwrite-services/AppwriteStorage";
import { PlayersResults, ResultsCritique, ResultsHeader, ResultsShowcase, ResultsStats } from "@/components/results"
import { useAIcritique, useLobbyDrawings, useLobbyPlayers, useLobbyStatus, usePlayAgain } from "@/hooks/TanstackQuery/useGameQueries";
import { useLobbyRealtime } from "@/hooks/TanstackQuery/useLobbyRealtime";
import { useAppStore } from "@/store/useAppStore";
import type { PlayersData } from "@/types/playersResultsData"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ResultsPage = () => {
  //we need to match players with there drawings then generate real urls from appwrite and display them

  const { lobbyId, playerId } = useAppStore();
  const navigate = useNavigate();

  useLobbyRealtime(lobbyId)


  const { data: players = [] } = useLobbyPlayers(lobbyId);
  const { data: lobby } = useLobbyStatus(lobbyId)
  const { data: drawings = [] } = useLobbyDrawings(lobbyId);

  const playAgain = usePlayAgain();//returns mutate function

  //if host clicks play again then navigate everyone to lobby page
  useEffect(() => {
    if (lobby?.status === "waiting") {
      navigate("/lobby");
    }
  }, [lobby?.status, navigate])

  /**
   * pass the lobby id and arr of players id to reset them
   *  
   * @returns 
   */
  const handlePlayAgain = async () => {
    if (!lobbyId) return;
    await playAgain.mutateAsync({
      lobbyId,
      playerIds: players.map(p => p.id),

    })
  }

  //check the curr player is host only then can click play again
  const isHost = players.find(p => p.id === playerId)?.isHost

  const referenceImageURL = lobby?.referenceImageId
    ? appwriteStorage.getFilePreview(lobby.referenceImageId)
    : "/";

  const firstDrawing = drawings.length > 0 ? drawings[0] : null;
  const firstDrawingArtist = players.find(p => p.id === firstDrawing?.playerId)?.name || "Unknown";

  const drawingURL = firstDrawing?.fileId
    ? appwriteStorage.getDrawingPreview(firstDrawing.fileId)
    : "/"

  const { data: aiResult, isLoading: isScoring } = useAIcritique(referenceImageURL, drawingURL);

  const Results: PlayersData[] = players.map(player => ({
    name: player.name,
    accuracy: player.id === firstDrawing?.playerId ? (aiResult?.score || 0) : 0,
    points: 0
  }))




  return (
    <div className="min-h-screen bg-background text-foreground">
      <ResultsHeader
        onPlayAgain={isHost ? handlePlayAgain : undefined}
        subtitle={isHost ? "Match concluede" : "Waiting for host to play again"} />
      < main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <ResultsShowcase
            similarityScore={`${Results[0]?.accuracy || 0}%`}
            referenceLabel="Reference object"
            referenceURL={referenceImageURL}
            artistName={firstDrawingArtist}
            drawingURL={drawingURL}
          />
          <ResultsCritique
            text={isScoring ? "The AI judge is analyzing the brushstrokes..." : (aiResult?.critique || "waiting for critique...")}
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <PlayersResults playersData={Results} />
          <ResultsStats timeSpent="01:42" strokes={142} />
        </div>
      </main>
    </div>
  )
}
export default ResultsPage