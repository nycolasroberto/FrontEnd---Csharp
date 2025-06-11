import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/', label: 'Início', icon: '🏠' },
    { path: '/games', label: 'Jogos', icon: '🎮' },
    { path: '/categories', label: 'Categorias', icon: '📂' },
  ];

  return (
    <div className="app-layout">

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">🎮 Catálogo de Games</h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={isActivePath(item.path) ? 'active' : ''}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>


      <main className="main-content">

        <header className="page-header">
          <button
            className="btn btn-outline-primary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ 
              display: 'none',
              marginRight: '1rem',
              padding: '0.5rem'
            }}
          >
            ☰
          </button>
          <h1 className="page-title">
            {location.pathname === '/' && 'Início'}
            {location.pathname === '/games' && 'Jogos'}
            {location.pathname === '/games/new' && 'Novo Jogo'}
            {location.pathname.includes('/games/edit') && 'Editar Jogo'}
            {location.pathname === '/categories' && 'Categorias'}
            {location.pathname === '/categories/new' && 'Nova Categoria'}
            {location.pathname.includes('/categories/edit') && 'Editar Categoria'}
          </h1>
        </header>


        <div className="page-content">
          {children}
        </div>
      </main>


      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'none'
          }}
        />
      )}
    </div>
  );
};

export default Layout;