import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gamesApi, categoriesApi } from '../../services/api';
import { Game, Category } from '../../types';

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterGames();
  }, [games, searchTerm, selectedCategory]);

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
      setError(err instanceof Error ? err.message : 'Erro ao carregar jogos');
    } finally {
      setLoading(false);
    }
  };

  const filterGames = () => {
    let filtered = games;

    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.desenvolvedor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(game =>
        game.categoriaId === parseInt(selectedCategory)
      );
    }

    setFilteredGames(filtered);
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o jogo "${nome}"?`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await gamesApi.delete(id);
      setGames(games.filter(game => game.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir jogo');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Carregando jogos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Erro:</strong> {error}
        <br />
        <button onClick={loadData} className="btn btn-outline-primary" style={{ marginTop: '1rem' }}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Controles de busca e filtro */}
      <div className="card search-container">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label className="form-label">Buscar jogos:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Digite o nome do jogo ou desenvolvedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ minWidth: '150px' }}>
            <label className="form-label">Filtrar por categoria:</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Link to="/games/new" className="btn btn-primary">
              + Novo Jogo
            </Link>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">
            Jogos ({filteredGames.length} {filteredGames.length === 1 ? 'encontrado' : 'encontrados'})
          </h2>
        </div>

        {filteredGames.length === 0 ? (
          <div className="empty-state">
            <h3>
              {games.length === 0 ? 'Nenhum jogo cadastrado' : 'Nenhum jogo encontrado'}
            </h3>
            <p>
              {games.length === 0 
                ? 'Comece adicionando seu primeiro jogo ao catálogo!'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
            {games.length === 0 && (
              <Link to="/games/new" className="btn btn-primary">
                Adicionar Primeiro Jogo
              </Link>
            )}
          </div>
        ) : (
          <div className="cards-grid">
            {filteredGames.map((game) => (
              <div key={game.id} className="game-card">
                <h3 className="game-card-title">{game.nome}</h3>
                <span className="game-card-category">
                  {game.categoria?.nome || 'Sem categoria'}
                </span>
                
                {game.descricao && (
                  <p style={{ 
                    color: 'var(--gray-600)', 
                    fontSize: '0.875rem', 
                    margin: '0.5rem 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {game.descricao}
                  </p>
                )}
                
                <p className="game-card-price">R$ {game.preco.toFixed(2)}</p>
                
                <p className="game-card-developer">
                  <strong>Desenvolvedor:</strong> {game.desenvolvedor}
                </p>
                
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', margin: '0.5rem 0' }}>
                  <strong>Lançamento:</strong> {formatDate(game.dataLancamento)}
                </p>

                <div className="game-card-actions">
                  <Link 
                    to={`/games/edit/${game.id}`} 
                    className="btn btn-outline-primary btn-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(game.id, game.nome)}
                    className="btn btn-danger btn-sm"
                    disabled={deleteLoading === game.id}
                  >
                    {deleteLoading === game.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameList;