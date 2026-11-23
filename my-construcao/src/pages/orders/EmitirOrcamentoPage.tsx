import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import {
  useListarClientesQuery,
  useListarProdutosQuery,
  useCriarOrcamentoMutation,
} from '../../services/api';
import { FormaPagamento, ItemOrcamento, OrcamentoResponse } from '../../types/types';

export const EmitirOrcamentoPage: React.FC = () => {
  const { data: clientes = [], isLoading: loadingClientes } = useListarClientesQuery();
  const { data: produtos = [], isLoading: loadingProdutos } = useListarProdutosQuery();
  const [criarOrcamento, { isLoading: isSaving }] = useCriarOrcamentoMutation();

  // Cabeçalho da venda
  const [clienteId, setClienteId] = useState<string>('');
  const [vendedorNome, setVendedorNome] = useState<string>('Carlos Silva (Balcão)');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('A_VISTA');
  const [parcelas, setParcelas] = useState<number>(1);
  const [descontoPercentual, setDescontoPercentual] = useState<number>(5);

  // Seleção atual de item
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(1);

  // Grade dinâmica de itens
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [espelhoPedido, setEspelhoPedido] = useState<OrcamentoResponse | null>(null);

  const produtoAtual = useMemo(
    () => produtos.find((p) => String(p.id) === produtoSelecionadoId),
    [produtos, produtoSelecionadoId]
  );

  const subtotalItemAtual = produtoAtual ? produtoAtual.precoVenda * quantidade : 0;

  const valorBruto = useMemo(
    () => itens.reduce((acc, item) => acc + item.subtotal, 0),
    [itens]
  );

  const valorTotalFinal = useMemo(() => {
    if (formaPagamento === 'COM_DESCONTO') {
      return valorBruto * (1 - descontoPercentual / 100);
    }
    return valorBruto;
  }, [valorBruto, formaPagamento, descontoPercentual]);

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const handleAdicionarItem = () => {
    if (!produtoAtual || quantidade <= 0) return;

    setItens((prev) => {
      const existente = prev.find((i) => String(i.produtoId) === String(produtoAtual.id));
      if (existente) {
        return prev.map((i) =>
          String(i.produtoId) === String(produtoAtual.id)
            ? {
                ...i,
                quantidade: i.quantidade + quantidade,
                subtotal: (i.quantidade + quantidade) * i.valorUnitario,
              }
            : i
        );
      }
      return [
        ...prev,
        {
          produtoId: produtoAtual.id,
          nomeProduto: produtoAtual.nome,
          quantidade,
          valorUnitario: produtoAtual.precoVenda,
          subtotal: produtoAtual.precoVenda * quantidade,
        },
      ];
    });

    setProdutoSelecionadoId('');
    setQuantidade(1);
  };

  const handleRemoverItem = (produtoId: number | string) => {
    setItens((prev) => prev.filter((item) => String(item.produtoId) !== String(produtoId)));
  };

  const handleFecharOrcamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || itens.length === 0) {
      alert('Selecione um cliente e adicione ao menos um item ao orçamento.');
      return;
    }

    try {
      const resposta = await criarOrcamento({
        clienteId,
        vendedorNome,
        formaPagamento,
        parcelas: formaPagamento === 'PARCELADO' ? parcelas : 1,
        descontoPercentual: formaPagamento === 'COM_DESCONTO' ? descontoPercentual : 0,
        valorTotal: Number(valorTotalFinal.toFixed(2)),
        itens: itens.map(({ produtoId, quantidade, valorUnitario, subtotal }) => ({
          produtoId,
          quantidade,
          valorUnitario,
          subtotal,
        })),
      }).unwrap();

      setEspelhoPedido(resposta);
    } catch {
      alert('Erro ao gravar orçamento na API.');
    }
  };

  if (loadingClientes || loadingProdutos) return <p>Carregando dados para emissão de orçamento...</p>;

  // Espelho do Pedido Gerado
  if (espelhoPedido) {
    const clientePedido = clientes.find((c) => String(c.id) === String(espelhoPedido.clienteId));
    return (
      <div style={{ background: '#fff', padding: '32px', borderRadius: '10px', maxWidth: '720px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#16a34a', marginBottom: '16px' }}>
          <CheckCircle2 size={32} />
          <div>
            <h2 style={{ margin: 0 }}>Orçamento Emitido com Sucesso!</h2>
            <span style={{ fontSize: '14px', color: '#475569' }}>
              Pedido #{espelhoPedido.id} • Status: <strong>{espelhoPedido.status || 'PENDENTE'}</strong>
            </span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

        <p><strong>Cliente:</strong> {clientePedido?.nome ?? espelhoPedido.clienteId}</p>
        <p><strong>Endereço de Entrega:</strong> {clientePedido ? `${clientePedido.rua}, ${clientePedido.numero} - ${clientePedido.bairro} (${clientePedido.pontoReferencia})` : '-'}</p>
        <p><strong>Vendedor:</strong> {espelhoPedido.vendedorNome}</p>
        <p><strong>Pagamento:</strong> {espelhoPedido.formaPagamento} {espelhoPedido.parcelas && espelhoPedido.parcelas > 1 ? `(${espelhoPedido.parcelas}x)` : ''}</p>
        <p style={{ fontSize: '20px', color: '#ea580c' }}>
          <strong>Valor Total Consolidado: {formatarMoeda(espelhoPedido.valorTotal)}</strong>
        </p>

        <button
          onClick={() => {
            setEspelhoPedido(null);
            setItens([]);
            setClienteId('');
          }}
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          Emitir Novo Orçamento
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleFecharOrcamento}>
      <h2>Emissão de Orçamento e Venda</h2>

      {/* 1. Cabeçalho Cliente e Vendedor */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>1. Dados do Atendimento</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <label style={labelStyle}>
            Cliente / Comprador *
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required style={inputStyle}>
              <option value="">-- Selecione um cliente --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.bairro} - {c.cidade})
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Vendedor Responsável *
            <select value={vendedorNome} onChange={(e) => setVendedorNome(e.target.value)} style={inputStyle}>
              <option value="Carlos Silva (Balcão)">Carlos Silva (Balcão)</option>
              <option value="Mariana Costa (Obras)">Mariana Costa (Obras)</option>
              <option value="Roberto Alves (Externo)">Roberto Alves (Externo)</option>
            </select>
          </label>
        </div>
      </div>

      {/* 2. Grade Dinâmica de Itens */}
      <div style={{ ...cardStyle, marginTop: '20px' }}>
        <h3 style={{ marginTop: 0 }}>2. Adicionar Produtos ao Pedido</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
          <label style={{ ...labelStyle, flex: 2, minWidth: '240px' }}>
            Produto em Estoque
            <select value={produtoSelecionadoId} onChange={(e) => setProdutoSelecionadoId(e.target.value)} style={inputStyle}>
              <option value="">-- Selecione um produto --</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {formatarMoeda(p.precoVenda)} (Estoque: {p.estoqueAtual} {p.unidade})
                </option>
              ))}
            </select>
          </label>

          <label style={{ ...labelStyle, width: '110px' }}>
            Quantidade
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              style={inputStyle}
            />
          </label>

          <div style={{ padding: '10px 14px', background: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
            Subtotal: <strong>{formatarMoeda(subtotalItemAtual)}</strong>
          </div>

          <button
            type="button"
            onClick={handleAdicionarItem}
            disabled={!produtoAtual}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            <Plus size={18} /> Inserir Item
          </button>
        </div>

        {/* Tabela de Itens Adicionados */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Produto</th>
              <th style={thStyle}>Qtd</th>
              <th style={thStyle}>Valor Unit.</th>
              <th style={thStyle}>Subtotal</th>
              <th style={thStyle}>Remover</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.produtoId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}>{item.nomeProduto}</td>
                <td style={tdStyle}>{item.quantidade}</td>
                <td style={tdStyle}>{formatarMoeda(item.valorUnitario)}</td>
                <td style={tdStyle}><strong>{formatarMoeda(item.subtotal)}</strong></td>
                <td style={tdStyle}>
                  <button
                    type="button"
                    onClick={() => handleRemoverItem(item.produtoId)}
                    style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {itens.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>
                  Nenhum produto adicionado ao orçamento ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Pagamento e Fechamento */}
      <div style={{ ...cardStyle, marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <label style={labelStyle}>
            Forma de Pagamento
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
              style={inputStyle}
            >
              <option value="A_VISTA">À Vista (Dinheiro / PIX)</option>
              <option value="PARCELADO">Parcelado (1x a 10x)</option>
              <option value="COM_DESCONTO">Com Desconto Especial</option>
            </select>
          </label>

          {formaPagamento === 'PARCELADO' && (
            <label style={labelStyle}>
              Parcelas
              <select value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))} style={inputStyle}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}x de {formatarMoeda(valorTotalFinal / n)}
                  </option>
                ))}
              </select>
            </label>
          )}

          {formaPagamento === 'COM_DESCONTO' && (
            <label style={labelStyle}>
              Desconto (%)
              <input
                type="number"
                min="1"
                max="50"
                value={descontoPercentual}
                onChange={(e) => setDescontoPercentual(Number(e.target.value))}
                style={{ ...inputStyle, width: '90px' }}
              />
            </label>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Valor Total do Orçamento</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ea580c' }}>
            {formatarMoeda(valorTotalFinal)}
          </div>
          <button
            type="submit"
            disabled={isSaving || itens.length === 0}
            style={{ marginTop: '10px', padding: '12px 24px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
          >
            {isSaving ? 'Fechando Pedido...' : 'FECHAR ORÇAMENTO'}
          </button>
        </div>
      </div>
    </form>
  );
};

const cardStyle: React.CSSProperties = { background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#334155' };
const inputStyle: React.CSSProperties = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' };
const thStyle: React.CSSProperties = { padding: '12px', fontSize: '13px', color: '#475569' };
const tdStyle: React.CSSProperties = { padding: '12px', fontSize: '14px', color: '#1e293b' };