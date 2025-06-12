import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../../services/api';
import { Category } from '../../types';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    const category = categories.find(c => c.id === id);
    const gameCount = category?.games?.length || 0;

    if (gameCount > 0) {
      alert(`Não é possível excluir a categoria "${nome}" pois ela possui ${gameCount} jogo(s) associado(s).`);
      return;
    }

    if (!window.confirm(`Tem certeza que deseja excluir a categoria "${nome}"?`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await categoriesApi.delete(id);
      setCategories(categories.filter(category => category.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir categoria');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Carregando categorias...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Erro:</strong> {error}
        <br />
        <button onClick={loadCategories} className="btn btn-outline-primary" style={{ marginTop: '1rem' }}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header com botão de nova categoria */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: 'var(--dark-color)' }}>
            Categorias ({categories.length})
          </h2>
          <Link to="/categories/new" className="btn btn-success">
            + Nova Categoria
          </Link>
        </div>
      </div>

      {/* Lista de categorias */}
      <div className="card">
        {categories.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhuma categoria cadastrada</h3>
            <p>Crie categorias para organizar melhor seus jogos!</p>
            <Link to="/categories/new" className="btn btn-success">
              Criar Primeira Categoria
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Jogos</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <strong style={{ color: 'var(--primary-color)' }}>
                        {category.nome}
                      </strong>
                    </td>
                    <td style={{ color: 'var(--gray-600)' }}>
                      {category.descricao || (
                        <em style={{ color: 'var(--gray-400)' }}>Sem descrição</em>
                      )}
                    </td>
                    <td>
                      <span 
                        className="game-card-category" 
                        style={{ 
                          backgroundColor: category.games?.length ? 'var(--success-color)' : 'var(--gray-400)',
                          fontSize: '0.75rem'
                        }}
                      >
                        {category.games?.length || 0} jogo(s)
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          to={`/categories/edit/${category.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id, category.nome)}
                          className="btn btn-danger btn-sm"
                          disabled={deleteLoading === category.id}
                          title={
                            category.games?.length 
                              ? `Não é possível excluir: ${category.games.length} jogo(s) associado(s)`
                              : 'Excluir categoria'
                          }
                        >
                          {deleteLoading === category.id ? 'Excluindo...' : 'Excluir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Informações adicionais */}
      {categories.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Estatísticas</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--primary-color)', margin: '0 0 0.5rem 0' }}>
                {categories.length}
              </h4>
              <p style={{ margin: 0, color: 'var(--gray-600)' }}>Total de Categorias</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--success-color)', margin: '0 0 0.5rem 0' }}>
                {categories.reduce((total, cat) => total + (cat.games?.length || 0), 0)}
              </h4>
              <p style={{ margin: 0, color: 'var(--gray-600)' }}>Total de Jogos</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--info-color)', margin: '0 0 0.5rem 0' }}>
                {categories.filter(cat => (cat.games?.length || 0) > 0).length}
              </h4>
              <p style={{ margin: 0, color: 'var(--gray-600)' }}>Categorias com Jogos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;