import { PlayersResults, ResultsCritique, ResultsHeader, ResultsShowcase, ResultsStats } from "@/components/results"
import type { PlayersData } from "@/types/playersResultsData"
const ResultsPage = () => {
  const Results: PlayersData[] = [
    { name: "saiprem", accuracy: 94, points: 1240 },
    { name: "prem", accuracy: 74, points: 890 },
    { name: "sai", accuracy: 78, points: 845 }

  ]
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ResultsHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <ResultsShowcase
            similarityScore="94.2%"
            referenceLabel="Reference object"
            referenceURL="/"
            artistName="prem"
            drawingURL="/"
          />
          <ResultsCritique
            text="The winner demonstrated exceptional spatial awareness in wing structure. Minor saturation variance is within professional range. Confidence score: 99.8%."
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