import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

const getFavoritesFromStorage = () => {
  const favorites = localStorage.getItem('favoriteMovies');
  return favorites ? JSON.parse(favorites) : [];
};

const saveFavoritesToStorage = (favorites) => {
  localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
};

const FavoriteMovieCard = ({ movie, onRemove }) => {
  const posterUrl = movie.Poster === 'N/A' ? 'https://via.placeholder.com/200x300?text=No+Image' : movie.Poster;

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.imdbID}`}>
        {posterUrl ? (
          <img src={posterUrl} alt={`${movie.Title} Poster`} />
        ) : (
          <div className="placeholder-poster">Sem Imagem</div>
        )}
        <h3>{movie.Title}</h3>
        <p>Ano: {movie.Year}</p>
      </Link>
      <button onClick={() => onRemove(movie.imdbID)} className="remove-button">
        Remover
      </button>
    </div>
  );
};


function Favorites() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    setFavoriteMovies(getFavoritesFromStorage());
  }, []);

  const handleRemoveFavorite = (idToRemove) => {
    const currentFavorites = getFavoritesFromStorage();
    const updatedFavorites = currentFavorites.filter(movie => movie.imdbID !== idToRemove);
    saveFavoritesToStorage(updatedFavorites);
    setFavoriteMovies(updatedFavorites);
  };

  return (
    <div className="container favorites-page">
      <h2>❤️ Meus Favoritos</h2>
      {favoriteMovies.length === 0 ? (
        <p className="info" style={{ textAlign: 'center' }}>Você ainda não salvou nenhum filme.</p>
      ) : (
        <div className="movie-list">
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