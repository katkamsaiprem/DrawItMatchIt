import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import type { LobbyMode } from "@/types/game"
import { appwriteDb } from "@/appwrite-services/AppwriteTablesDB"
import { useState } from "react"

const getMode = (params: URLSearchParams): LobbyMode => (params.get("mode") === "join" ? "join" : "create")

function NameFlowForm() {
  const [params] = useSearchParams()
  const navigate = useNavigate();


  const mode = getMode(params)
  const isJoinMode = mode === "join"

  const [playerName, setPlayerName] = useState("");
  const [lobbyCode, setLobbyCode] = useState("");

  const userId = localStorage.getItem('userId')

  const handleCreate = async () => {
    if (!playerName.trim() || !userId) return

    const { lobby, player } = await appwriteDb.createLobby(userId, playerName)
    localStorage.setItem("lobbyId", lobby.$id);
    localStorage.setItem("playerId", player.$id);
    localStorage.setItem("lobbyCode", lobby.roomId ?? "");
    navigate("/lobby")

  }


  const handlejoin = async () => {
    if (!userId || !playerName.trim() || !lobbyCode.trim()) return;
    const { lobby, player } = await appwriteDb.joinLobby(
      lobbyCode.trim().toUpperCase(),
      userId,
      playerName.trim()
    )
    localStorage.setItem("lobbyId", lobby.$id)
    localStorage.setItem('playerId', player.$id)
    localStorage.setItem("lobbyCode", lobby.roomId ?? "");
    navigate("/lobby")


  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set up your player</CardTitle>
        <CardDescription>Choose whether to create a lobby or join with a code.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg border p-1">
          <Button onClick={handleCreate} asChild variant={mode === "create" ? "default" : "ghost"} type="button">
            <Link to="/name?mode=create">Create</Link>
          </Button>
          <Button asChild variant={mode === "join" ? "default" : "ghost"} type="button">
            <Link to="/name?mode=join">Join</Link>
          </Button>
        </div>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (isJoinMode) {
              void handlejoin();
            } else {
              void handleCreate();
            }
          }}>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="player-name">
              Your name
            </label>
            <Input
              id="player-name"
              placeholder="Type your name"
              maxLength={20}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)} />
          </div>

          {isJoinMode ? (
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="lobby-code">
                Lobby code
              </label>
              <Input
                id="lobby-code"
                placeholder="AB12CD"
                maxLength={6}
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value)} />
            </div>
          ) : null}

          <CardFooter className="px-0 pb-0">
            <Button className="w-full" size="lg" type="submit">
              {isJoinMode ? "Join lobby" : "Create lobby"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card >
  )
}

export default NameFlowForm
//type sumbit makes button to submit the form