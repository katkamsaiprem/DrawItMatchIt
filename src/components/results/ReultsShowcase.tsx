import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"

type ResultsShowcaseProps = {
    similarityScore: string
    referenceLabel: string
    referenceURL: string
    artistName: string
    drawingURL: string
}

const ResultsShowcase = ({
    similarityScore,
    referenceLabel,
    referenceURL,
    artistName,
    drawingURL,
}: ResultsShowcaseProps) => {

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Artistic Precision</CardTitle>
                <CardDescription>AI-Similarity score: {similarityScore}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                    <p className="mb-2 text-xs uppercase text-muted-foreground">
                        {referenceLabel}
                    </p>
                    <div className="overflow-hidden rounded-lg border">
                        <img
                            src={referenceURL}
                            alt="Reference"
                            className="h-40 w-full object-cover"
                        />
                    </div>
                </div>
                <div>
                    <p className="mb-2 text-xs uppercase text-muted-foreground">
                        By artist: {artistName}
                    </p>
                    <div className="overflow-hidden rounded-lg border">
                        <img
                            src={drawingURL}
                            alt="Player drawing"
                            className="h-40 w-full object-cover"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
export default ResultsShowcase;