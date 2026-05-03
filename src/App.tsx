import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import HomePage from "@/pages/HomePage"
import LobbyPage from "@/pages/LobbyPage"
import NameInputPage from "@/pages/NameInputPage"
import GamePage from "@/pages/GamePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/name" element={<NameInputPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/gamePlay" element={<GamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
