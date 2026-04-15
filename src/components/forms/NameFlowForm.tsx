import { Link, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import type { LobbyMode } from "@/types/game"

const getMode = (params: URLSearchParams): LobbyMode => (params.get("mode") === "join" ? "join" : "create")

function NameFlowForm() {
  const [params] = useSearchParams()

  const mode = getMode(params)
  const isJoinMode = mode === "join"

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

        <form className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="player-name">
              Your name
            </label>
            <Input id="player-name" placeholder="Type your name" maxLength={20} />
          </div>

          {isJoinMode ? (
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="lobby-code">
                Lobby code
              </label>
              <Input id="lobby-code" placeholder="AB12CD" maxLength={6} />
            </div>
          ) : null}

          <CardFooter className="px-0 pb-0">
            <Button asChild className="w-full" size="lg" type="button">
              <Link to="/lobby">{isJoinMode ? "Join lobby" : "Create lobby"}</Link>
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

export default NameFlowForm
