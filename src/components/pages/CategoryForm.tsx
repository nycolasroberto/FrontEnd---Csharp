import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriesApi } from '../../services/api';
import { CategoryFormData, ValidationErrors } from '../../types';

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CategoryFormData>({
    nome: '',
    descricao: ''
  });

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (isEditing && id) {
      loadCategory(parseInt(id));
    }
  }, [id, isEditing]);

  const loadCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      const category = await categoriesApi.getById(categoryId);
      setFormData({
        nome: category.nome,
        descricao: category.descricao || ''
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao carregar categoria');
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da categoria é obrigatório';
    } else if (formData.nome.length > 100) {
      newErrors.nome = 'Nome deve ter no máximo 100 caracteres';
    }

    if (formData.descricao.length > 500) {
      newErrors.descricao = 'Descrição deve ter no máximo 500 caracteres';
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

      const categoryData = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim() || undefined
      };

      if (isEditing && id) {
        await categoriesApi.update(parseInt(id), { ...categoryData, id: parseInt(id) });
      } else {
        await categoriesApi.create(categoryData);
      }

      navigate('/categories');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar categoria');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        Carregando categoria...
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome" className="form-label">Nome da Categoria *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: Ação, RPG, Estratégia..."
            maxLength={100}
          />
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
          <small style={{ color: 'var(--gray-500)' }}>
            {formData.nome.length}/100 caracteres
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="descricao" className="form-label">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descrição detalhada da categoria..."
            rows={4}
            maxLength={500}
          />
          {errors.descricao && <div className="invalid-feedback">{errors.descricao}</div>}
          <small style={{ color: 'var(--gray-500)' }}>
            {formData.descricao.length}/500 caracteres
          </small>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="submit"
            className="btn btn-success"
            disabled={saveLoading}
          >
            {saveLoading ? 'Salvando...' : (isEditing ? 'Atualizar Categoria' : 'Criar Categoria')}
          </button>
          
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => navigate('/categories')}
            disabled={saveLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;