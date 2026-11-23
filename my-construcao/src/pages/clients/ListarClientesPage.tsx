// src/pages/clients/ListarClientesPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useListarClientesQuery, useDeletarClienteMutation } from '../../services/api';

export const ListarClientesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: clientes = [], isLoading, isError } = useListarClientesQuery();
  const [deletarCliente] = useDeletarClienteMutation();

  const handleExcluir = async (id: number | string, nome: string) => {
    if (window.confirm(`Excluir o cliente "${nome}"?`)) {
      try {
        await deletarCliente(id).unwrap();
      } catch {
        alert('Erro ao excluir cliente.');
      }
    }
  };

  if (isLoading) return <p>Carregando lista de clientes...</p>;
  if (isError) return <p style={{ color: 'red' }}>Erro ao carregar clientes da API.</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gestão de Clientes e Endereços</h2>
        <button
          onClick={() => navigate('/clients/register')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Nome do Cliente</th>
              <th style={thStyle}>Telefone / WhatsApp</th>
              <th style={thStyle}>Bairro</th>
              <th style={thStyle}>Cidade</th>
              <th style={thStyle}>Ponto de Referência</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}><strong>{cliente.nome}</strong></td>
                <td style={tdStyle}>{cliente.telefone}</td>
                <td style={tdStyle}>{cliente.bairro}</td>
                <td style={tdStyle}>{cliente.cidade}</td>
                <td style={tdStyle}>{cliente.pontoReferencia}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/clients/${cliente.id}`)}
                      style={{ padding: '6px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleExcluir(cliente.id, cliente.nome)}
                      style={{ padding: '6px', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = { padding: '14px 16px', fontSize: '13px', color: '#475569' };
const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: '14px', color: '#1e293b' };