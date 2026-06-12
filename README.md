# 🎨 DrawItMatchIt

> **Draw it. Match it. Win it.**  
> A real-time multiplayer drawing game where players race to trace a reference image — and an AI judge decides who did it best.

---

## ✨ What is DrawItMatchIt?

**DrawItMatchIt** is a browser-based multiplayer game where players join a shared room, are shown a reference image as an overlay on their canvas, and must draw it as accurately as possible before the timer runs out. When time's up, **Google Gemini AI** analyzes every drawing, scores it for similarity, and delivers a personalized critique — then ranks all players on a leaderboard.

---

## 🚀 Features

- 🏠 **Room-based multiplayer** — Create a game room and share the code with friends, or join an existing one
- 👥 **Lobby system** — Players join, mark themselves ready, and the host starts the game
- 🖼️ **Reference image overlay** — A semi-transparent image is overlaid on your canvas to guide your drawing
- 🎨 **Full-featured drawing canvas** — Adjustable brush size, color palette, eraser, undo/redo, and clear
- ⏱️ **Countdown timer** — Beat the clock; when time's up, your drawing is automatically submitted
- 🤖 **AI Judge (Google Gemini)** — Each drawing is scored for accuracy and given a written critique
- 🏆 **Results leaderboard** — Players are ranked by their AI similarity score
- 🔄 **Play again** — Host can reset and start a new round without leaving the room
- ⚡ **Real-time sync** — Lobby and game state are synced live via Appwrite Realtime subscriptions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite 8](https://vitejs.dev/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) |
| Server State / Caching | [TanStack Query v5](https://tanstack.com/query) |
| Backend & Database | [Appwrite Cloud](https://appwrite.io/) (Auth, DB, Storage, Realtime) |
| AI Scoring | [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Icons | [Tabler Icons](https://tabler.io/icons) |
| Drawing | [simple-drawing-board](https://github.com/leader22/simple-drawing-board.js) |
| Timer | [react-timer-hook](https://github.com/amrlabib/react-timer-hook) |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- An [Appwrite Cloud](https://cloud.appwrite.io/) account and project
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/katkamsaiprem/DrawItMatchIt.git
cd DrawItMatchIt
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
VITE_APPWRITE_PROJECT_ID="your_project_id"
VITE_APPWRITE_PROJECT_NAME="your_project_name"
VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
VITE_APPWRITE_DB_ID="your_db_id"
VITE_LOBBIES_TABLE_ID="your_lobbies_collection_id"
VITE_PLAYERS_TABLE_ID="your_players_collection_id"
VITE_DRAWINGS_TABLE_ID="your_drawings_collection_id"
VITE_REFERENCE_IMAGES_BUCKET_ID="your_reference_images_bucket_id"
VITE_DRAWING_BUCKET_ID="your_drawing_bucket_id"
VITE_GEMINI_API_KEY="your_gemini_api_key"
```

### 4. Set up Appwrite

In your Appwrite project, create the following resources:

**Database Collections:**

| Collection | Key Attributes |
|---|---|
| `lobbies` | `code`, `status`, `referenceImageId`, `startedAt` |
| `players` | `lobbyId`, `name`, `isReady`, `isHost`, `status` |
| `drawings` | `lobbyId`, `playerId`, `fileId`, `similarityScore`, `critique` |

**Storage Buckets:**
- `reference_images` — stores the reference image for each game
- `drawings` — stores each player's submitted drawing

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎮 How to Play

1. **Create a Room** — Click **New game**, enter your name, and a room is created with a shareable code.
2. **Join a Room** — Click **Join game**, enter your name and the room code shared by the host.
3. **Lobby** — Players join and click **Set as ready**. The host clicks **Start Game** once at least one player is ready.
4. **Draw!** — The game screen shows a reference image as a semi-transparent overlay. Use the toolbar to draw it as accurately as you can before the countdown ends.
5. **AI Judging** — When all players finish (or time runs out), Google Gemini analyzes each drawing and scores it for similarity to the reference.
6. **Results** — See your score, your drawing side-by-side with the reference, and your personalized AI critique. All players are ranked on the leaderboard.
7. **Play Again** — The host can start a new round for the same room.

---

## 📁 Project Structure

```
src/
├── appwrite-services/     # Appwrite SDK wrappers (Account, DB, Storage, Realtime, Gemini)
├── components/
│   ├── canvas/            # DrawingCanvas, Toolbar
│   ├── game/              # Countdown, ReferenceImage, RoomSidebar
│   ├── lobby/             # LobbyHeader, PlayerList
│   ├── results/           # ResultsHeader, ResultsShowcase, ResultsCritique, PlayersResults
│   └── ui/                # Shared UI (Button, Card, NavBar, etc.)
├── context/               # React context providers
├── hooks/
│   └── TanstackQuery/     # useGameQueries, useLobbyRealtime
├── pages/                 # HomePage, NameInputPage, LobbyPage, GamePage, ResultsPage
├── store/                 # Zustand global store (useAppStore)
├── types/                 # TypeScript type definitions
└── lib/                   # Utility functions
```

---

## 🧱 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    React Frontend                    │
│  HomePage → NameInputPage → LobbyPage → GamePage    │
│                         ↓                           │
│                    ResultsPage                       │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
     ┌─────────▼──────────┐  ┌────────▼────────────┐
     │   Appwrite Cloud   │  │  Google Gemini API   │
     │  ─────────────── │  │  ─────────────────  │
     │  • Auth (anon)     │  │  • Image similarity  │
     │  • Database        │  │    scoring           │
     │  • Storage         │  │  • Drawing critique  │
     │  • Realtime        │  └─────────────────────┘
     └────────────────────┘
```

State is managed at two levels:
- **Local / UI state** — React `useState` / `useRef` inside components
- **Global session state** — [Zustand](https://zustand-demo.pmnd.rs/) (`lobbyId`, `playerId`, `userId`, `lobbyCode`)
- **Server state** — [TanStack Query](https://tanstack.com/query) with Appwrite Realtime for live updates

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ using React, Appwrite, and Google Gemini
</div>
