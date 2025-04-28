import React, { useState, useEffect } from 'react';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';

const API_KEY = 'da76538c'; // Your OMDb API Key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('avengers'); // Default search term

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null); // Reset error before new fetch
      try {
        // Using the 's' parameter for searching multiple movies
        const response = await fetch(`${API_URL}&s=${searchTerm}`);
        if (!response.ok) {
          // Handle HTTP errors like 4xx, 5xx
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.Response === 'True') {
          setMovies(data.Search); // OMDb returns results in the 'Search' array
        } else {
          // Handle API-specific errors (e.g., "Movie not found!")
          setError(data.Error || 'Nenhum filme encontrado.');
          setMovies([]); // Clear previous movies if search fails
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError('Erro ao carregar filmes. Verifique a conexão ou a API.');
        setMovies([]); // Clear movies on fetch error
      } finally {
        setLoading(false);
      }
    };

    // Fetch movies when the component mounts or searchTerm changes
    if (searchTerm) { // Only fetch if searchTerm is not empty
      fetchMovies();
    } else {
      setMovies([]); // Clear movies if search term is empty
      setLoading(false);
    }

    // Cleanup function (optional)
    // return () => { console.log("Home component unmounting"); };

  }, [searchTerm]); // Re-run effect when searchTerm changes

  // Basic search input handler (can be improved)
  const handleSearch = (event) => {
    event.preventDefault();
    const newSearchTerm = event.target.elements.search.value;
    setSearchTerm(newSearchTerm);
  }

  return (
    <div className="container">
      {/* Basic Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <input
          type="text"
          name="search"
          placeholder="Buscar filmes..."
          defaultValue={searchTerm} /* Use defaultValue for initial value */
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Buscar</button>
      </form>

      {loading && <Loading />}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <MovieList movies={movies} />}
    </div>
  );
}

export default Home;


// import React from 'react';


// //da76538c
// // minha chave da api de filmes
// export default function Home() {
//   return (
//     <div className="home">
//       <h1>Home</h1>
//       <p>Welcome to the home page!</p>
//     </div>
//   );
// }