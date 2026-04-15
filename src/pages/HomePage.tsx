import { Link } from "react-router-dom";
import NavBar from "../components/ui/NavBar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";



const HomePage = () => {
    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/60">
            <NavBar subtitle="Two teams. Fast rounds. Frantic rematch." />

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
                        <p>1. Split into two teams of 2 or more players.</p>
                        <p>2. Draw and guess words faster than the other team.</p>
                        <p>3. Replay the same words in a frantic final round.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default HomePage;