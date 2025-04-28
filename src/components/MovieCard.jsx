import React from 'react';
import { Link } from 'react-router-dom';

// Function to get a placeholder image if the actual poster is N/A
const getPosterUrl = (poster) => {
  return poster === 'N/A' ? null : poster;
};

function MovieCard({ movie }) {
  const posterUrl = getPosterUrl(movie.Poster);

  return (
    <div className="movie-card">
      {posterUrl ? (
        <img src={posterUrl} alt={`${movie.Title} Poster`} />
      ) : (
        <div className="placeholder-poster">Sem Imagem</div>
      )}
      <h3>{movie.Title}</h3>
      <p>Ano: {movie.Year}</p>
      {/* Use imdbID for the details link */}
      <Link to={`/movie/${movie.imdbID}`} className="details-button">
        Ver Detalhes
      </Link>
    </div>
  );
}

export default MovieCard;