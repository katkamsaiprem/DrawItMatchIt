
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,// data is fresh for 5 minutes, if you ask same data within 5 min ,it gives you the cached version without calling appwrite again
      gcTime: 1000 * 60 * 10,//once the component is umounts ,the cached data will stays in memory for 10 min ,then after garbage collection removes it 
      refetchOnWindowFocus: false,
      retry: 1,//limits the retries like appwrite error "lobby not found "should not call endlessly

    }
  }
});

createRoot(document.getElementById('root')!).render(

  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>

)
