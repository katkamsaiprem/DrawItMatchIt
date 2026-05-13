import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"


type ResultsStatsProps = {
    timeSpent: string
    strokes: number
}

const ResultsStats = ({ timeSpent, strokes }: ResultsStatsProps) => {
    return (<>
        <Card>
            <CardHeader>
                <CardTitle>Stats</CardTitle>
                <CardDescription>Round totals</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time spent</span>
                    <span className="font-medium">{timeSpent}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Strokes</span>
                    <span className="font-medium">{strokes}</span>
                </div>
            </CardContent>

        </Card>

    </>)
}
export default ResultsStats