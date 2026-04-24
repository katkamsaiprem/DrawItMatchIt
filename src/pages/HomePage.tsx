import { Link } from "react-router-dom";
import NavBar from "../components/ui/NavBar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";



const HomePage = () => {
    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/60">
            <NavBar subtitle="." />
            <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold tracking-tight">draw it. match it. win it.</CardTitle>
                        <CardDescription>
                            UI preview for the game flow screens.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild className="w-full sm:w-auto" size="lg"><Link to="/name?mode=create">New game</Link></Button>
                        <Button asChild className="w-full sm:w-auto" size="lg" variant="secondary"><Link to="/name?mode=join">Join game</Link></Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How it works</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>1. The host creates a game room and shares the invite link with friends. </p>
                        <p>2. After everyone joins, the host starts the game..</p>
                        <p>3. The AI gives each round a word prompt (for example, “cat”), and players draw that word.</p>
                        <p>4. Players are judged on drawing quality, and the best drawing wins the round/game.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default HomePage;