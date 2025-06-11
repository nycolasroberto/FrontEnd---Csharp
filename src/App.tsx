import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/pages/Home';
import GameList from './components/pages/GameList';
import GameForm from './components/pages/GameForm';
import CategoryList from './components/pages/CategoryList';
import CategoryForm from './components/pages/CategoryForm';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GameList />} />
        <Route path="/games/new" element={<GameForm />} />
        <Route path="/games/edit/:id" element={<GameForm />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/new" element={<CategoryForm />} />
        <Route path="/categories/edit/:id" element={<CategoryForm />} />
      </Routes>
    </Layout>
  );
}

export default App;