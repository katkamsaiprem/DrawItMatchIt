import type { PlayersData } from "@/types/playersResultsData"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Progress } from "../ui/progress"

type PlayersDataProps = {
    playersData: PlayersData[]
}

const PlayersResults = ({ playersData }: PlayersDataProps) => {
    return (<>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Match Players</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {playersData.map((player, index) => (
                    <div key={player.name} className="grid gap-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                                #{index + 1} {player.name}
                            </span>
                            <span className="text-muted-foreground">+{player.points}</span>
                        </div>
                        <Progress value={player.accuracy}></Progress>

                    </div>
                ))}

            </CardContent>
        </Card>

    </>)
}
export default PlayersResults;