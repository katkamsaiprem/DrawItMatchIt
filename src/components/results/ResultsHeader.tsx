import NavBar from "@/components/ui/NavBar"
import { Button } from "@/components/ui/Button"

type ResultsHeaderProps = {
  title?: string
  subtitle?: string
  onPlayAgain?: () => void
}

const ResultsHeader = ({
  title = "Final Results",
  subtitle = "Match concluded",
  onPlayAgain,
}: ResultsHeaderProps) => {
  return (
    <>
      <NavBar
        subtitle={subtitle}
        rightSlot={
          <div className="flex gap-2">
            <Button onClick={onPlayAgain}>Play Again</Button>
          </div>
        }
      />
      <div className="mx-auto w-full max-w-5xl px-4 pt-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {subtitle}
        </p>
        <h2 className="text-3xl font-semibold">{title}</h2>
      </div>
    </>
  )
}

export default ResultsHeader