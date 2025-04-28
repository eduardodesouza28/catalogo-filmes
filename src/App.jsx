import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react'
import Home from './pages/home';
import { Layout } from './components/Layout/Layout';

export default function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='*' element={<h1>404</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>

  );
}