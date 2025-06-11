# Sistema de Catálogo de Games

Um sistema completo para catalogar jogos com backend em C# (.NET 8) e frontend em React TypeScript.

## 🎮 Funcionalidades

- **CRUD Completo**: Criação, leitura, atualização e exclusão de games
- **Categorias**: Sistema de categorização dos jogos
- **Busca e Filtros**: Busca por nome e filtro por categoria
- **Validações**: Validações completas no frontend e backend
- **Interface Responsiva**: Design adaptável para desktop e mobile
- **API RESTful**: Backend seguindo padrões REST

## 🏗️ Arquitetura

### Backend (C#/.NET 8)
- **Entity Framework Core**: ORM para acesso ao banco de dados
- **SQLite**: Banco de dados em arquivo
- **Web API**: Controllers RESTful
- **Data Annotations**: Validações de modelo
- **CORS**: Configurado para permitir requisições do frontend

### Frontend (React TypeScript)
- **React 18**: Biblioteca para interface do usuário
- **TypeScript**: Tipagem estática
- **CSS Puro**: Estilização customizada sem frameworks
- **Fetch API**: Comunicação com a API
- **Validações**: Validação de formulários no cliente

## 📋 Pré-requisitos

### Backend
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Visual Studio Code ou Visual Studio

### Frontend
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- npm ou yarn

## 🚀 Como Executar

### 1. Backend (API)

```bash
# Navegue até a pasta do backend
cd backend

# Restaure as dependências
dotnet restore

# Execute as migrações do banco de dados
dotnet ef database update

# Execute a aplicação
dotnet run
```

A API estará disponível em: `https://localhost:7001` ou `http://localhost:5001`

### 2. Frontend (React)

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Execute a aplicação
npm start
```

O frontend estará disponível em: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
.
├── backend/                 # API em C#
│   ├── Controllers/         # Controllers da API
│   ├── Models/             # Modelos de dados
│   ├── Data/               # Contexto do Entity Framework
│   ├── Migrations/         # Migrações do banco de dados
│   └── Program.cs          # Configuração da aplicação
├── frontend/               # Interface React
│   ├── public/             # Arquivos públicos
│   ├── src/                # Código fonte
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Serviços de API
│   │   ├── types/          # Tipos TypeScript
│   │   └── styles/         # Arquivos CSS
│   └── package.json        # Dependências do Node.js
└── README.md              # Este arquivo
```

## 🛠️ Configuração de Desenvolvimento

### Backend
1. Abra a pasta `backend` no Visual Studio Code
2. Instale a extensão "C# Dev Kit" se ainda não tiver
3. Execute `dotnet restore` para restaurar dependências
4. Execute `dotnet ef database update` para criar o banco
5. Execute `dotnet run` para iniciar a API

### Frontend
1. Abra a pasta `frontend` no Visual Studio Code
2. Execute `npm install` para instalar dependências
3. Execute `npm start` para iniciar o servidor de desenvolvimento

## 🗄️ Banco de Dados

O sistema utiliza SQLite com as seguintes entidades:

### Categories (Categorias)
- Id (int, PK)
- Nome (string, obrigatório)
- Descricao (string, opcional)

### Games (Jogos)
- Id (int, PK)
- Nome (string, obrigatório)
- Descricao (string, opcional)
- DataLancamento (DateTime, obrigatório)
- Preco (decimal, obrigatório)
- Desenvolvedor (string, obrigatório)
- CategoriaId (int, FK)

### Relacionamento
- Um Game pertence a uma Category (N:1)
- Uma Category pode ter vários Games (1:N)

## 🔧 Endpoints da API

### Categories
- `GET /api/categories` - Lista todas as categorias
- `GET /api/categories/{id}` - Busca categoria por ID
- `POST /api/categories` - Cria nova categoria
- `PUT /api/categories/{id}` - Atualiza categoria
- `DELETE /api/categories/{id}` - Remove categoria

### Games
- `GET /api/games` - Lista todos os games
- `GET /api/games/{id}` - Busca game por ID
- `POST /api/games` - Cria novo game
- `PUT /api/games/{id}` - Atualiza game
- `DELETE /api/games/{id}` - Remove game
- `GET /api/games/search?nome={nome}` - Busca games por nome

## ✅ Validações

### Backend (C#)
- Campos obrigatórios validados com Data Annotations
- Validação de tipos e formatos
- Validação de relacionamentos (FK)

### Frontend (React)
- Validação de campos obrigatórios
- Validação de formatos (email, data, etc.)
- Feedback visual de erros
- Prevenção de submissão com dados inválidos

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvido por

Sistema desenvolvido como exemplo de aplicação full-stack com C# e React.