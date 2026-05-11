import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import HomePage from "@/pages/HomePage"
import LobbyPage from "@/pages/LobbyPage"
import NameInputPage from "@/pages/NameInputPage"
import GamePage from "@/pages/GamePage"//@ it maps to src folder
import ResultsPage from "@/pages/ResultsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/name" element={<NameInputPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/gamePlay" element={<GamePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />//this line is catch all route, any unmatched path renders navigate to redirect to / . replace props the current history entry so the user cant hit back and return to unknown url
      </Routes>
    </BrowserRouter>
  )
}

export default App
