import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites'; // Import Favorites page
import './style.css'; // Import global styles

function App() {
  return (
    <Router>
      <header className="app-header">
        <h1>🎬 Mini Catálogo de Filmes</h1>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/favorites">Favoritos</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Route parameter :id will hold the imdbID */}
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          {/* Optional: Add a 404 Not Found route */}
          <Route path="*" element={<div className='container'><p style={{ textAlign: 'center' }}>Página não encontrada!</p></div>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;