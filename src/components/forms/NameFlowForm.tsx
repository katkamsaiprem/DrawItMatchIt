import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import type { LobbyMode } from "@/types/game"

import { useState } from "react"
import { useCreateLobby, useJoinLobby } from "@/hooks/TanstackQuery/useGameQueries"

const getMode = (params: URLSearchParams): LobbyMode => (params.get("mode") === "join" ? "join" : "create")

function NameFlowForm() {
  const [params] = useSearchParams()
  const navigate = useNavigate();


  const mode = getMode(params)
  const isJoinMode = mode === "join"

  const [playerName, setPlayerName] = useState("");
  const [lobbyCode, setLobbyCode] = useState("");

  const userId = localStorage.getItem('userId')

  //tanstack createLobby Mutation
  const createLobby = useCreateLobby();
  const joinLobby = useJoinLobby();

  const handleCreate = async () => {
    if (createLobby.isPending) return;  // prevent double req
    if (!playerName.trim() || !userId) return;
    await createLobby.mutateAsync({ userId, playerName })
    navigate("/lobby")

  }


  const handlejoin = async () => {
    if (joinLobby.isPending) return;  //  prevent double req
    if (!userId || !playerName.trim() || !lobbyCode.trim()) return;
    await joinLobby.mutateAsync({
      lobbyCode: lobbyCode.trim().toUpperCase(),
      userId,
      playerName: playerName.trim(),
    })
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
          <Button asChild variant={mode === "create" ? "default" : "ghost"} type="button">
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
            <Button className="w-full" size="lg" type="submit"
              disabled={createLobby.isPending || joinLobby.isPending}>
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