import './App.css';
import { useState, createContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {

  // Create a state for the outfitFeed array
  const [outfitFeed, setOutfitFeed] = useState([]);

  // Create a context for the outfitFeed array to avoid prop drilling
  const FeedContext = createContext();

  // Create a query client for managing GET / POST requests
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <FeedContext.Provider value={{outfitFeed, setOutfitFeed}}>
        <div className="App">
          <p> HELLO WORLD </p>
        </div>
      </FeedContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
