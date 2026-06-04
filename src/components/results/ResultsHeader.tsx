import NavBar from "@/components/ui/NavBar"
import { Button } from "@/components/ui/Button"

type ResultsHeaderProps = {
  title?: string
  subtitle?: string
  isHost?: boolean
  onPlayAgain?: () => void
}

const ResultsHeader = ({
  title = "Final Results",
  subtitle = "Match concluded",
  isHost = false,
  onPlayAgain,
}: ResultsHeaderProps) => {
  return (
    <>
      <NavBar
        subtitle={subtitle}
        rightSlot={
          <div className="flex gap-2">
            {isHost ? (
              <Button onClick={onPlayAgain}>Play Again</Button>
            ) : (
              <p className="text-sm text-muted-foreground">Waiting for host to start again...</p>
            )}
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