import { Game, Category } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Configuração comum para requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// Função auxiliar para tratar erros de API
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro ${response.status}: ${response.statusText}`);
  }
  return response;
};

// === GAMES API ===

export const gamesApi = {
  // Buscar todos os games
  getAll: async (): Promise<Game[]> => {
    const response = await fetch(`${API_BASE_URL}/games`);
    await handleApiError(response);
    return response.json();
  },

  // Buscar game por ID
  getById: async (id: number): Promise<Game> => {
    const response = await fetch(`${API_BASE_URL}/games/${id}`);
    await handleApiError(response);
    return response.json();
  },

  // Buscar games por nome
  search: async (nome: string): Promise<Game[]> => {
    const response = await fetch(`${API_BASE_URL}/games/search?nome=${encodeURIComponent(nome)}`);
    await handleApiError(response);
    return response.json();
  },

  // Criar novo game
  create: async (game: Omit<Game, 'id' | 'categoria'>): Promise<Game> => {
    const response = await fetch(`${API_BASE_URL}/games`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(game),
    });
    await handleApiError(response);
    return response.json();
  },

  // Atualizar game existente
  update: async (id: number, game: Omit<Game, 'categoria'>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(game),
    });
    await handleApiError(response);
  },

  // Deletar game
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      method: 'DELETE',
    });
    await handleApiError(response);
  },
};

// === CATEGORIES API ===

export const categoriesApi = {
  // Buscar todas as categorias
  getAll: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    await handleApiError(response);
    return response.json();
  },

  // Buscar categoria por ID
  getById: async (id: number): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    await handleApiError(response);
    return response.json();
  },

  // Criar nova categoria
  create: async (category: Omit<Category, 'id' | 'games'>): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(category),
    });
    await handleApiError(response);
    return response.json();
  },

  // Atualizar categoria existente
  update: async (id: number, category: Omit<Category, 'games'>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(category),
    });
    await handleApiError(response);
  },

  // Deletar categoria
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    await handleApiError(response);
  },
};