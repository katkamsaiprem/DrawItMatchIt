import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import HomePage from "@/pages/HomePage"
import LobbyPage from "@/pages/LobbyPage"
import NameInputPage from "@/pages/NameInputPage"
import GamePage from "@/pages/GamePage"//@ it maps to src folder
import ResultsPage from "@/pages/ResultsPage"
import { appwriteAccount } from "./appwrite-services/AppwriteAccount"
import { useEffect } from "react"
import { useAppStore } from "./store/useAppStore"

function App() {
  const { setUserId, setLobbyId, setPlayerId, setLobbyCode } = useAppStore()
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setLobbyId(localStorage.getItem("lobbyId"));
    setPlayerId(localStorage.getItem("playerId"));
    setLobbyCode(localStorage.getItem("lobbyCode"));
  }, [setLobbyCode, setPlayerId, setLobbyId, setUserId])


  useEffect(() => {
    let isMounted = true;//this flag is used to know that when component is not mounted ,then not call 

    const initSession = async () => {
      try {
        const id = await appwriteAccount.ensureSession()
        if (isMounted) setUserId(id ?? null);//?? returns  right side if left side is null or undefined else left side
        if (id) localStorage.setItem("userId", id);
      }
      catch (err) {
        console.error("Failed to create session", err)
      }

    };
    void initSession();

    return () => {//cleanup function , runs when comp unmounts
      isMounted = false;
    };
  }, []);


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
