import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"

type ResultsCritiqueProps = {
    title?: string
    subtitle?: string
    text: string
}

const ResultsCritique = ({ title = "AI Critique",
    subtitle = "Neural analysis",
    text,
}: ResultsCritiqueProps) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{text}</CardContent>
            </Card>
        </>
    )
}
export default ResultsCritique