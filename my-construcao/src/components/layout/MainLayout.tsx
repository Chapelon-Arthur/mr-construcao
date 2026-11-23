import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Package, Users, ShoppingCart, HardHat } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    color: isActive ? '#ffffff' : '#cbd5e1',
    backgroundColor: isActive ? '#ea580c' : 'transparent',
    marginBottom: '6px',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar Fixa */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#fff', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <HardHat size={32} color="#f97316" />
          <div>
            <h1 style={{ fontSize: '18px', margin: 0 }}>Mr. Construção</h1>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Sistema ERP & PDV</span>
          </div>
        </div>

        <nav>
          <NavLink to="/products/consult" style={linkStyle}>
            <Package size={20} />
            Produtos e Estoque
          </NavLink>
          <NavLink to="/clients/consult" style={linkStyle}>
            <Users size={20} />
            Clientes e Entregas
          </NavLink>
          <NavLink to="/orders/new" style={linkStyle}>
            <ShoppingCart size={20} />
            Orçamentos e Vendas
          </NavLink>
        </nav>
      </aside>

      {/* Conteúdo Dinâmico */}
      <main style={{ flex: 1, backgroundColor: '#f8fafc', padding: '32px' }}>
        <Outlet />
      </main>
    </div>
  );
};