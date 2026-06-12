import type { LobbyPlayer } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

type RoomSidebarProps = {
    players: LobbyPlayer[]
    selfPlayerId: string
}

const statusMeta: Record<NonNullable<LobbyPlayer["status"]>, { label: string; tone: string; icon: string }> = {
    drawing: { label: "Drawing...", tone: "text-foreground", icon: "edit" },
    finished: { label: "Finished", tone: "text-emerald-600", icon: "check" },
    thinking: { label: "Thinking...", tone: "text-muted-foreground", icon: "psychology" },
}

const RoomSidebar = ({ players, selfPlayerId }: RoomSidebarProps) => {

    return (<>
        <aside className="w-56 flex flex-col gap-4">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Players in Room</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {players.map((player) => {
                        const isSelf = player.id === selfPlayerId
                        const status = player.status && statusMeta[player.status]
                        const statusText = player.statusText ?? status?.label ?? "Waiting..."

                        return (
                            <div
                                key={player.id}
                                className={[
                                    "flex items-center gap-3 rounded-lg border px-2.5 py-2 transition-colors",
                                    isSelf ? "border-primary/40 bg-primary/5" : "hover:bg-muted/40",
                                ].join(" ")}
                            >
                                <div>
                                    <p className={isSelf ? "text-sm font-bold" : "text-sm font-semibold text-muted-foreground"}>
                                        {player.name}{isSelf ? " (You)" : ""}
                                    </p>
                                    <p className={["text-[10px] font-medium", status?.tone ?? "text-muted-foreground"].join(" ")}>
                                        {statusText}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>

            </Card>
        </aside >
    </>)
}
export default RoomSidebar;