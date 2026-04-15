import type { ReactNode } from "react"

type NavBarProps = {
    subtitle?: string
    rightSlot?: ReactNode
}

const NavBar = ({ subtitle, rightSlot }: NavBarProps) => {
    return (
        <header className="border-b bg-background/90 backdrop-blur">
            <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
                <div>
                    <h1 className="text-base font-semibold tracking-tight">DrawItMatchIt</h1>
                    {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
                </div>
                {rightSlot ? <div>{rightSlot}</div> : null}
            </nav>
        </header>
    )
}

export default NavBar;