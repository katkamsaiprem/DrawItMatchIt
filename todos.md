connect Landing buttons to routing in homePage✅


leave room✅


TODO
implement Drawing canvas
INFO
  -ctx holds state(how pen look right now ) and methods (actions that pen can do)
  -In react to touch real dom element ,you use useRef this gives direct access to the element without causing rerenders

  -get mouse position relative to canvas
  Browser window starts here →  (0,0)
                               │
                               │  ← navbar 60px tall
                               │  ← some padding 20px
                               │
                         Canvas starts here → (120, 80)
                               │
                               │   cursor is here → clientX=400, clientY=200
  -

Random room code generator 
implement time selector

implement drawing canvas✅
--ToolBox✅
 -brush size✅
 -color palette✅
 -Eraser✅
 -Undo/Redo✅

implement countdown using shadcn ✅
 --when players enters gameplay ,countdown should start ,✅
 --if countdown reaches completes then navigate to ResultsPage✅



 
Backend services and Db using Appwrite TODOS
TODO

 Create Appwrite Cloud project + Web platform note endpoint and project ID.  ✅
 Add Vite env vars for Appwrite ✅
 Install Appwrite SDK and initialize client module.  ✅
 Create database + collections ✅
 Create storage bucket✅
 Define attributes + indexes  ✅
 Decide auth: start with anonymous session create session on app load. ✅ 
 Implement lobby create/join and player upsert.  ✅
 Replace preview data in Lobby UI with real reads/writes.  ✅

 lets use Zustand global store common data + session context ✅ 
 tanstack query to sync with db ✅
 Add realtime subscriptions for lobby + players.✅  
 Implement game start + player status updates.  ✅

 Upload drawing PNG to storage + save drawings document.  ✅
 Add Appwrite Function for AI analysis✅
 Store AI results in results and render Results page from DB.  ✅
 Add loading/error states and cleanup for realtime subscriptions.✅

 done✅






