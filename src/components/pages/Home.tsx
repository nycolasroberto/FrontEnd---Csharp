import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gamesApi, categoriesApi } from '../../services/api';
import { Game, Category } from '../../types';

const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [gamesData, categoriesData] = await Promise.all([
          gamesApi.getAll(),
          categoriesApi.getAll()
        ]);
        setGames(gamesData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Carregando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Erro:</strong> {error}
      </div>
    );
  }

  const recentGames = games.slice(0, 6);

  return (
    <div>

      <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', margin: '0', color: 'var(--primary-color)' }}>
            {games.length}
          </h3>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--gray-600)' }}>Total de Jogos</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', margin: '0', color: 'var(--success-color)' }}>
            {categories.length}
          </h3>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--gray-600)' }}>Categorias</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', margin: '0', color: 'var(--info-color)' }}>
            R$ {games.reduce((total, game) => total + game.preco, 0).toFixed(2)}
          </h3>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--gray-600)' }}>Valor Total</p>
        </div>
      </div>


      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Ações Rápidas</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/games/new" className="btn btn-primary">
            + Adicionar Novo Jogo
          </Link>
          <Link to="/categories/new" className="btn btn-success">
            + Nova Categoria
          </Link>
          <Link to="/games" className="btn btn-outline-primary">
            Ver Todos os Jogos
          </Link>
          <Link to="/categories" className="btn btn-outline-primary">
            Gerenciar Categorias
          </Link>
        </div>
      </div>


      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Jogos Recentes</h2>
          <Link to="/games" className="btn btn-outline-primary btn-sm">
            Ver Todos
          </Link>
        </div>
        
        {recentGames.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum jogo cadastrado</h3>
            <p>Comece adicionando seu primeiro jogo ao catálogo!</p>
            <Link to="/games/new" className="btn btn-primary">
              Adicionar Primeiro Jogo
            </Link>
          </div>
        ) : (
          <div className="cards-grid">
            {recentGames.map((game) => (
              <div key={game.id} className="game-card">
                <h3 className="game-card-title">{game.nome}</h3>
                <span className="game-card-category">
                  {game.categoria?.nome || 'Sem categoria'}
                </span>
                <p className="game-card-price">R$ {game.preco.toFixed(2)}</p>
                <p className="game-card-developer">
                  <strong>Desenvolvedor:</strong> {game.desenvolvedor}
                </p>
                <div className="game-card-actions">
                  <Link to={`/games/edit/${game.id}`} className="btn btn-outline-primary btn-sm">
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Categorias</h2>
          <Link to="/categories" className="btn btn-outline-primary btn-sm">
            Gerenciar
          </Link>
        </div>
        
        {categories.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhuma categoria cadastrada</h3>
            <p>Crie categorias para organizar melhor seus jogos!</p>
            <Link to="/categories/new" className="btn btn-success">
              Criar Primeira Categoria
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {categories.map((category) => (
              <div key={category.id} className="card" style={{ margin: 0 }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>
                  {category.nome}
                </h4>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                  {category.descricao || 'Sem descrição'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: 'var(--gray-500)' }}>
                    {category.games?.length || 0} jogo(s)
                  </small>
                  <Link to={`/categories/edit/${category.id}`} className="btn btn-outline-primary btn-sm">
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;