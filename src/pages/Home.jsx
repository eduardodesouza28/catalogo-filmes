import React, { useState, useEffect } from 'react';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';

const API_KEY = 'da76538c'; // Your OMDb API Key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const initialSearchTerms = [
  'star', 'love', 'dark', 'space', 'time', 'king', 'war', 'life', 'magic', 'future',
  'world', 'city', 'dragon', 'power', 'secret', 'lost', 'home', 'dream', 'night', 'sun',
  'blood', 'galaxy', 'monster', 'ghost', 'robot', 'island', 'alien', 'game', 'hero',
  'shadow', 'moon', 'fire', 'ice', 'heart', 'legend', 'quest', 'paradise', 'storm', 'silence',
  'forest', 'ocean', 'mountain', 'journey', 'destiny', 'revenge', 'treasure', 'phantom', 'mirror', 'witch',
  'sorcerer', 'vampire', 'zombie', 'pirate', 'samurai', 'knight', 'spy', 'detective', 'sheriff', 'outlaw',
  'angel', 'demon', 'prophecy', 'curse', 'chosen', 'savior', 'invasion', 'apocalypse', 'paradox', 'dimension',
  'parallel', 'experiment', 'clone', 'mutant', 'superhero', 'villain', 'sidekick', 'mentor', 'apprentice', 'wizard',
  'artifact', 'relic', 'scroll', 'crystal', 'sword', 'shield', 'arrow', 'gun', 'spaceship', 'time machine',
  'portal', 'labyrinth', 'castle', 'temple', 'ruins', 'underground', 'cavern', 'volcano', 'desert', 'jungle',
  'metropolis', 'dystopia', 'utopia', 'colony', 'frontier', 'wild west', 'noir', 'neon', 'cyber', 'steampunk'
];

// --- New: Helper function to get a random term ---
const getRandomSearchTerm = () => {
  const randomIndex = Math.floor(Math.random() * initialSearchTerms.length);
  return initialSearchTerms[randomIndex];
};

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Modified: Initialize searchTerm state with a random term ONCE ---
  // The function passed to useState runs only on the initial render.
  const [searchTerm, setSearchTerm] = useState(() => getRandomSearchTerm());

  // State to hold the current value of the input field separately
  // This makes the input "controlled" and easier to manage updates
  const [inputValue, setInputValue] = useState(searchTerm);


  useEffect(() => {
    const fetchMovies = async () => {
      // Don't fetch if the searchTerm is empty after a user clears the input
      if (!searchTerm) {
        setMovies([]);
        setLoading(false);
        setError(null); // Clear errors if search term is empty
        return;
      }

      setLoading(true);
      setError(null); // Reset error before new fetch
      console.log(`Fetching movies for term: ${searchTerm}`); // Log the search term

      try {
        // Using the 's' parameter for searching multiple movies/series
        const response = await fetch(`${API_URL}&s=${encodeURIComponent(searchTerm)}`); // Encode the search term
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.Response === 'True') {
          setMovies(data.Search); // OMDb returns results in the 'Search' array
        } else {
          // Handle API-specific errors (e.g., "Movie not found!", "Too many results.")
          setError(data.Error || `Nenhum resultado encontrado para "${searchTerm}".`);
          setMovies([]); // Clear previous movies if search fails
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError('Erro ao buscar dados. Verifique a conexão ou a API.');
        setMovies([]); // Clear movies on fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchMovies(); // Fetch movies when the component mounts or searchTerm changes

  }, [searchTerm]); // Re-run effect ONLY when searchTerm changes

  // Update input field state when user types
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Handle form submission
  const handleSearch = (event) => {
    event.preventDefault();
    // Update the actual searchTerm only when the form is submitted
    // Trim whitespace to avoid searching for just spaces
    const newSearchTerm = inputValue.trim();
    if (newSearchTerm) {
      setSearchTerm(newSearchTerm);
    } else {
      // Optional: Handle empty submission (e.g., clear results or show message)
      setSearchTerm(''); // Trigger useEffect to clear results
      setError("Por favor, digite um termo para buscar.");
    }
  };

  return (
    <div className="container">
      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <input
          type="text"
          name="search"
          placeholder="Buscar filmes ou séries..."
          value={inputValue} // Controlled input
          onChange={handleInputChange} // Update state on change
          style={{ padding: '0.5rem', marginRight: '0.5rem', minWidth: '250px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Buscar</button>
      </form>

      {loading && <Loading />}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (movies.length > 0
        ? <MovieList movies={movies} />
        : <p className="info">Nenhum resultado encontrado.</p> // Generic message if no error but no movies
      )}
      {/* Show the search term if no results and no error */}
      {!loading && !error && movies.length === 0 && searchTerm && (
        <p className="info">Nenhum resultado encontrado para "{searchTerm}".</p>
      )}
    </div>
  );
}

export default Home;