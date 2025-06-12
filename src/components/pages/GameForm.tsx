import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gamesApi, categoriesApi } from '../../services/api';
import { Game, Category, GameFormData, ValidationErrors } from '../../types';

const GameForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<GameFormData>({
    nome: '',
    descricao: '',
    dataLancamento: '',
    preco: '',
    desenvolvedor: '',
    categoriaId: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    loadCategories();
    if (isEditing && id) {
      loadGame(parseInt(id));
    }
  }, [id, isEditing]);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const loadGame = async (gameId: number) => {
    try {
      setLoading(true);
      const game = await gamesApi.getById(gameId);
      setFormData({
        nome: game.nome,
        descricao: game.descricao || '',
        dataLancamento: game.dataLancamento.split('T')[0], // Formato YYYY-MM-DD
        preco: game.preco.toString(),
        desenvolvedor: game.desenvolvedor,
        categoriaId: game.categoriaId.toString()
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao carregar jogo');
      navigate('/games');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do jogo é obrigatório';
    } else if (formData.nome.length > 200) {
      newErrors.nome = 'Nome deve ter no máximo 200 caracteres';
    }

    if (formData.descricao.length > 1000) {
      newErrors.descricao = 'Descrição deve ter no máximo 1000 caracteres';
    }

    if (!formData.dataLancamento) {
      newErrors.dataLancamento = 'Data de lançamento é obrigatória';
    }

    if (!formData.preco.trim()) {
      newErrors.preco = 'Preço é obrigatório';
    } else {
      const preco = parseFloat(formData.preco);
      if (isNaN(preco) || preco < 0 || preco > 999.99) {
        newErrors.preco = 'Preço deve ser um número entre 0 e 999,99';
      }
    }

    if (!formData.desenvolvedor.trim()) {
      newErrors.desenvolvedor = 'Desenvolvedor é obrigatório';
    } else if (formData.desenvolvedor.length > 150) {
      newErrors.desenvolvedor = 'Nome do desenvolvedor deve ter no máximo 150 caracteres';
    }

    if (!formData.categoriaId) {
      newErrors.categoriaId = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaveLoading(true);

      const gameData = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim() || undefined,
        dataLancamento: formData.dataLancamento,
        preco: parseFloat(formData.preco),
        desenvolvedor: formData.desenvolvedor.trim(),
        categoriaId: parseInt(formData.categoriaId)
      };

      if (isEditing && id) {
        await gamesApi.update(parseInt(id), { ...gameData, id: parseInt(id) });
      } else {
        await gamesApi.create(gameData);
      }

      navigate('/games');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar jogo');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Remove o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Carregando jogo...
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          {isEditing ? 'Editar Jogo' : 'Novo Jogo'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome" className="form-label">Nome do Jogo *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: The Legend of Zelda"
            maxLength={200}
          />
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="descricao" className="form-label">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descrição detalhada do jogo..."
            rows={4}
            maxLength={1000}
          />
          {errors.descricao && <div className="invalid-feedback">{errors.descricao}</div>}
          <small style={{ color: 'var(--gray-500)' }}>
            {formData.descricao.length}/1000 caracteres
          </small>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="dataLancamento" className="form-label">Data de Lançamento *</label>
            <input
              type="date"
              id="dataLancamento"
              name="dataLancamento"
              className={`form-control ${errors.dataLancamento ? 'is-invalid' : ''}`}
              value={formData.dataLancamento}
              onChange={handleChange}
            />
            {errors.dataLancamento && <div className="invalid-feedback">{errors.dataLancamento}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="preco" className="form-label">Preço (R$) *</label>
            <input
              type="number"
              id="preco"
              name="preco"
              className={`form-control ${errors.preco ? 'is-invalid' : ''}`}
              value={formData.preco}
              onChange={handleChange}
              placeholder="Ex: 59.99"
              min="0"
              max="999.99"
              step="0.01"
            />
            {errors.preco && <div className="invalid-feedback">{errors.preco}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="desenvolvedor" className="form-label">Desenvolvedor *</label>
          <input
            type="text"
            id="desenvolvedor"
            name="desenvolvedor"
            className={`form-control ${errors.desenvolvedor ? 'is-invalid' : ''}`}
            value={formData.desenvolvedor}
            onChange={handleChange}
            placeholder="Ex: Nintendo EPD"
            maxLength={150}
          />
          {errors.desenvolvedor && <div className="invalid-feedback">{errors.desenvolvedor}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="categoriaId" className="form-label">Categoria *</label>
          <select
            id="categoriaId"
            name="categoriaId"
            className={`form-control ${errors.categoriaId ? 'is-invalid' : ''}`}
            value={formData.categoriaId}
            onChange={handleChange}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.nome}
              </option>
            ))}
          </select>
          {errors.categoriaId && <div className="invalid-feedback">{errors.categoriaId}</div>}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saveLoading}
          >
            {saveLoading ? 'Salvando...' : (isEditing ? 'Atualizar Jogo' : 'Criar Jogo')}
          </button>
          
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => navigate('/games')}
            disabled={saveLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameForm;