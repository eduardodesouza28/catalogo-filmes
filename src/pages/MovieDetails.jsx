import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '../components/Loading';
import '../style.css';


const API_KEY = 'da76538c';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;


const getFavoritesFromStorage = () => {
  const favorites = localStorage.getItem('favoriteMovies');
  return favorites ? JSON.parse(favorites) : [];
};

const saveFavoritesToStorage = (favorites) => {
  localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
};

function MovieDetails() {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}&i=${id}&plot=full`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.Response === 'True') {
          setMovieDetails(data);
          const favorites = getFavoritesFromStorage();
          setIsFavorite(favorites.some(favMovie => favMovie.imdbID === data.imdbID));
        } else {
          setError(data.Error || 'Filme não encontrado.');
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError('Erro ao carregar detalhes do filme.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!movieDetails) return;

    const currentFavorites = getFavoritesFromStorage();
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = currentFavorites.filter(favMovie => favMovie.imdbID !== movieDetails.imdbID);
    } else {
      const favoriteData = {
        imdbID: movieDetails.imdbID,
        Title: movieDetails.Title,
        Poster: movieDetails.Poster,
        Year: movieDetails.Year
      };
      updatedFavorites = [...currentFavorites, favoriteData];
    }

    saveFavoritesToStorage(updatedFavorites);
    setIsFavorite(!isFavorite);
  };


  if (loading) return <Loading />;
  if (error) return <p className="error">{error}</p>;
  if (!movieDetails) return <p className="info">Detalhes do filme não disponíveis.</p>;

  const posterUrl = movieDetails.Poster === 'N/A' ? 'https://via.placeholder.com/300x450?text=No+Image' : movieDetails.Poster;


  return (
    <div className="container">
      <a href="/catalogo-filmes" className="back-link"> ←-</a>
      <div className="movie-details">
        <img src={posterUrl} alt={`${movieDetails.Title} Poster`} />
        <div className="details-content">
          <h2>{movieDetails.Title} ({movieDetails.Year})</h2>
          <p><strong>Gênero:</strong> {movieDetails.Genre}</p>
          <p><strong>Diretor:</strong> {movieDetails.Director}</p>
          <p><strong>Atores:</strong> {movieDetails.Actors}</p>
          <p><strong>Data de Lançamento:</strong> {movieDetails.Released}</p>
          <p><strong>Nota IMDb:</strong> ⭐ {movieDetails.imdbRating}</p>
          <p><strong>Sinopse:</strong> {movieDetails.Plot}</p>

          <button
            onClick={handleFavoriteToggle}
            className={isFavorite ? 'fav-button-remove' : 'fav-button-add'}
          >
            {isFavorite ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;