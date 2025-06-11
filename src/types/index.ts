// Tipos TypeScript para as entidades do sistema

export interface Category {
  id: number;
  nome: string;
  descricao?: string;
  games?: Game[];
}

export interface Game {
  id: number;
  nome: string;
  descricao?: string;
  dataLancamento: string; // ISO date string
  preco: number;
  desenvolvedor: string;
  categoriaId: number;
  categoria?: Category;
}

// Tipos para formulários
export interface GameFormData {
  nome: string;
  descricao: string;
  dataLancamento: string;
  preco: string;
  desenvolvedor: string;
  categoriaId: string;
}

export interface CategoryFormData {
  nome: string;
  descricao: string;
}

// Tipos para validação
export interface ValidationErrors {
  [key: string]: string;
}

// Tipos para API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}