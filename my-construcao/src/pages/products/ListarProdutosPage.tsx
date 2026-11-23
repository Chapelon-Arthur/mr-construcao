import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useListarProdutosQuery, useDeletarProdutoMutation } from '../../services/api';

export const ListarProdutosPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: produtos = [], isLoading, isError } = useListarProdutosQuery();
  const [deletarProduto] = useDeletarProdutoMutation();

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const handleExcluir = async (id: number | string, nome: string) => {
    if (window.confirm(`Deseja realmente excluir o produto "${nome}"?`)) {
      try {
        await deletarProduto(id).unwrap();
      } catch {
        alert('Erro ao excluir produto.');
      }
    }
  };

  if (isLoading) return <p>Carregando catálogo de produtos...</p>;
  if (isError) return <p style={{ color: 'red' }}>Erro ao carregar produtos da API. Verifique a conexão.</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gestão de Produtos e Estoque</h2>
        <button
          onClick={() => navigate('/products/register')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Código</th>
              <th style={thStyle}>Nome do Produto</th>
              <th style={thStyle}>Marca</th>
              <th style={thStyle}>Preço de Venda</th>
              <th style={thStyle}>Estoque Atual</th>
              <th style={thStyle}>Unidade</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}>{produto.codigo}</td>
                <td style={tdStyle}><strong>{produto.nome}</strong></td>
                <td style={tdStyle}>{produto.marca}</td>
                <td style={tdStyle}>{formatarMoeda(produto.precoVenda)}</td>
                <td style={tdStyle}>{produto.estoqueAtual}</td>
                <td style={tdStyle}>{produto.unidade}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/products/${produto.id}`)}
                      title="Editar"
                      style={{ padding: '6px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleExcluir(produto.id, produto.nome)}
                      title="Excluir"
                      style={{ padding: '6px', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {produtos.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  Nenhum produto cadastrado no estoque.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = { padding: '14px 16px', fontSize: '13px', color: '#475569' };
const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: '14px', color: '#1e293b' };