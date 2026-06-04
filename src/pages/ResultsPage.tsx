import { appwriteStorage } from "@/appwrite-services/AppwriteStorage";
import { PlayersResults, ResultsCritique, ResultsHeader, ResultsShowcase } from "@/components/results"
import { useLobbyDrawings, useLobbyPlayers, useLobbyStatus, usePlayAgain, useSaveAIResult } from "@/hooks/TanstackQuery/useGameQueries";
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
  const saveAIResult = useSaveAIResult();

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

  //score each players drawing ,only call ai if not already saved in appwrite
  useEffect(() => {
    if (!referenceImageURL || referenceImageURL === "/") return;

    drawings.forEach((drawing: any) => {
      //skip result saved in appwrite
      if (drawing.similarityScore != null) return;

      const drawingURL = drawing.fileId
        ? appwriteStorage.getDrawingPreview(drawing.fileId)
        : null;

      if (!drawingURL) return;

      saveAIResult.mutate({
        drawingId: drawing.$id,
        referenceUrl: referenceImageURL,
        drawingUrl: drawingURL
      })
    })
  }, [drawings, referenceImageURL])


  /**
   * Build results for each player, matched with their drawing scores
   * 
   *  rank by accuracy descending
   */
  const Results: PlayersData[] = players.map(player => {
    const playerDrawing = drawings.find((d: any) => d.playerId === player.id);
    const score = playerDrawing?.similarityScore ?? 0;
    return {
      name: player.name,
      accuracy: score,
      points: score,
    }
  }).sort((a, b) => b.accuracy - a.accuracy)


  // const firstDrawing = drawings.length > 0 ? drawings[0] : null;
  // const firstDrawingArtist = players.find(p => p.id === firstDrawing?.playerId)?.name || "Unknown";

  // const drawingURL = firstDrawing?.fileId
  //   ? appwriteStorage.getDrawingPreview(firstDrawing.fileId)
  //   : "/"

  // const { data: aiResult, isLoading: isScoring } = useAIcritique(referenceImageURL, drawingURL);


  /**
   * For the showcase, show the CURRENT PLAYER's own drawing and critique
   */
  const myDrawing = drawings.find((d: any) => d.playerId === playerId);
  const myName = players.find(p => p.id === playerId)?.name || "Unknown";
  const myScore = myDrawing?.similarityScore ?? 0;
  const myDrawingURL = myDrawing?.fileId
    ? appwriteStorage.getDrawingPreview(myDrawing.fileId)
    : "/";
  const myCritique = myDrawing?.critique || "The AI judge is analyzing, please wait for few seconds..."
  const isScoring = drawings.some((d: any) => d.similarityScore == null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ResultsHeader
        isHost={!!isHost}
        onPlayAgain={isHost ? handlePlayAgain : undefined}
        subtitle={isHost ? "Match concluded" : "Waiting for host to play again"} />
      < main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <ResultsShowcase
            similarityScore={`${myScore}%`}
            referenceLabel="Reference object"
            referenceURL={referenceImageURL}
            artistName={myName}
            drawingURL={myDrawingURL}
          />
          <ResultsCritique
            text={isScoring ? "The AI judge is analyzing the brushstrokes..." : myCritique}
          />
        </div>

        <div className="mt-6">
          <PlayersResults playersData={Results} />
        </div>
      </main>
    </div>
  )
}
export default ResultsPage