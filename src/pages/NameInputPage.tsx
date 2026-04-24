import NameFlowForm from "@/components/forms/NameFlowForm"
import NavBar from "@/components/ui/NavBar"

const NameInputPage = () => {
    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/50">
            <NavBar subtitle="Pick your name and get into a lobby." />

            <main className="mx-auto w-full max-w-xl px-4 py-10">
                <NameFlowForm />
            </main>
        </div>
    )
}   

export default NameInputPage