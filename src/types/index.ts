
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
  dataLancamento: string; 
  preco: number;
  desenvolvedor: string;
  categoriaId: number;
  categoria?: Category;
}

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

export interface ValidationErrors {
  [key: string]: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}