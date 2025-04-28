import React, { useState, useEffect } from 'react';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';

const API_KEY = 'da76538c'; // Your OMDb API Key
const API_URL_BASE = `https://www.omdbapi.com/?apikey=${API_KEY}`;

// --- Predefined list of popular movie IMDb IDs ---
// (Pick a few well-known movies)
const popularMovieIds = [
  'tt0133093', // The Matrix
  'tt1375666', // Inception
  'tt0468569', // The Dark Knight
  'tt0111161', // The Shawshank Redemption
  'tt0109830', // Forrest Gump
  'tt0110912', // Pulp Fiction
  'tt0068646', // The Godfather
  'tt0816692', // Interstellar
];

function Home() {
  // State for the predefined popular movies
  const [popularMovies, setPopularMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorPopular, setErrorPopular] = useState(null);

  // State for search results
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false); // Initially false
  const [errorSearch, setErrorSearch] = useState(null);

  // State for the search input field
  const [inputValue, setInputValue] = useState(''); // Start empty

  // State to track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false);

  // --- Effect to fetch predefined popular movies ON MOUNT ONLY ---
  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoadingPopular(true);
      setErrorPopular(null);
      try {
        // Create an array of fetch promises for each ID
        const promises = popularMovieIds.map(id =>
          fetch(`${API_URL_BASE}&i=${id}`).then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error fetching ID ${id}! status: ${res.status}`);
            }
            return res.json();
          })
        );

        // Wait for all promises to resolve
        const moviesData = await Promise.all(promises);

        // Filter out any potential errors from individual fetches if OMDb returns Response=False
        const successfulMovies = moviesData.filter(movie => movie.Response === 'True');

        if (successfulMovies.length === 0 && moviesData.length > 0) {
          // Handle case where all fetches failed specifically
          throw new Error("Não foi possível buscar os detalhes dos filmes populares.");
        }

        setPopularMovies(successfulMovies);

      } catch (err) {
        console.error("Error fetching popular movies:", err);
        setErrorPopular('Erro ao carregar filmes populares.');
        setPopularMovies([]); // Clear in case of error
      } finally {
        setLoadingPopular(false);
      }
    };

    fetchPopularMovies();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Function to perform search ---
  const performSearch = async (searchTerm) => {
    if (!searchTerm) {
      setErrorSearch("Por favor, digite um termo para buscar.");
      setSearchResults([]);
      setLoadingSearch(false);
      return; // Exit if search term is empty
    }

    setLoadingSearch(true);
    setErrorSearch(null);
    setSearchResults([]); // Clear previous results

    try {
      const response = await fetch(`${API_URL_BASE}&s=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.Response === 'True') {
        setSearchResults(data.Search);
      } else {
        setErrorSearch(data.Error || `Nenhum resultado encontrado para "${searchTerm}".`);
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setErrorSearch('Erro ao buscar dados. Verifique a conexão ou a API.');
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // --- Handlers for the search form ---
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    // Optionally clear search error message while typing
    if (errorSearch) setErrorSearch(null);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const searchTerm = inputValue.trim();
    setHasSearched(true); // Mark that a search has been attempted/performed
    performSearch(searchTerm);
  };

  // --- Render Logic ---
  return (
    <div className="container">
      {/* Search Form - Always visible */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <input
          type="text"
          name="search"
          placeholder="Buscar filmes ou séries..."
          value={inputValue}
          onChange={handleInputChange}
          style={{ padding: '0.5rem', marginRight: '0.5rem', minWidth: '250px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Buscar</button>
      </form>

      {/* --- Conditional Content Area --- */}
      <div>
        {!hasSearched ? (
          // --- Display Popular Movies (Before Search) ---
          <>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Filmes Populares</h2>
            {loadingPopular && <Loading />}
            {errorPopular && <p className="error">{errorPopular}</p>}
            {!loadingPopular && !errorPopular && (
              popularMovies.length > 0
                ? <MovieList movies={popularMovies} />
                : <p className="info">Não foi possível carregar filmes populares.</p>
            )}
          </>
        ) : (
          // --- Display Search Results (After Search) ---
          <>
            {/* Optional: Add a heading for search results */}
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Resultados da Busca</h2>
            {loadingSearch && <Loading />}
            {errorSearch && <p className="error">{errorSearch}</p>}
            {!loadingSearch && !errorSearch && (
              searchResults.length > 0
                ? <MovieList movies={searchResults} />
                : <p className="info">Nenhum resultado encontrado para "{inputValue.trim() || 'sua busca'}".</p> // Show message even if list is empty
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;