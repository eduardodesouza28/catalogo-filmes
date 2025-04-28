import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

// Re-use helper functions or define them here if not using a hook
const getFavoritesFromStorage = () => {
  const favorites = localStorage.getItem('favoriteMovies');
  return favorites ? JSON.parse(favorites) : [];
};

const saveFavoritesToStorage = (favorites) => {
  localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
};

// Re-use or adapt MovieCard or create a simpler one
const FavoriteMovieCard = ({ movie, onRemove }) => {
  const posterUrl = movie.Poster === 'N/A' ? 'https://via.placeholder.com/200x300?text=No+Image' : movie.Poster;

  return (
    <div className="movie-card"> {/* Reuse movie-card styling */}
      <Link to={`/movie/${movie.imdbID}`}> {/* Link to details */}
        {posterUrl ? (
          <img src={posterUrl} alt={`${movie.Title} Poster`} />
        ) : (
          <div className="placeholder-poster">Sem Imagem</div>
        )}
        <h3>{movie.Title}</h3>
        <p>Ano: {movie.Year}</p>
      </Link>
      {/* Button to remove directly from this page */}
      <button onClick={() => onRemove(movie.imdbID)} className="remove-button">
        Remover
      </button>
    </div>
  );
};


function Favorites() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    // Load favorites when the component mounts
    setFavoriteMovies(getFavoritesFromStorage());
  }, []); // Empty dependency array means run once on mount

  const handleRemoveFavorite = (idToRemove) => {
    const currentFavorites = getFavoritesFromStorage();
    const updatedFavorites = currentFavorites.filter(movie => movie.imdbID !== idToRemove);
    saveFavoritesToStorage(updatedFavorites);
    setFavoriteMovies(updatedFavorites); // Update the state to re-render the list
  };

  return (
    <div className="container favorites-page">
      <h2>❤️ Meus Favoritos</h2>
      {favoriteMovies.length === 0 ? (
        <p className="info" style={{ textAlign: 'center' }}>Você ainda não salvou nenhum filme.</p>
      ) : (
        <div className="movie-list"> {/* Reuse movie-list grid */}
          {favoriteMovies.map((movie) => (
            <FavoriteMovieCard
              key={movie.imdbID}
              movie={movie}
              onRemove={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;