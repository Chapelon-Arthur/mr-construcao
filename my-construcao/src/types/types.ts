// --- MÓDULO A: PRODUTOS ---
export interface Produto {
  id: number | string;
  codigo: string; // EAN-13 ou código interno
  nome: string;
  marca: string;
  familia: string; // Ex: Alvenaria, Elétrica, Pintura
  precoVenda: number;
  estoqueAtual: number;
  unidade: string; // Ex: Saco, Metro, Unidade
}

export type ProdutoDTO = Omit<Produto, 'id'>;

// --- MÓDULO B: CLIENTES ---
export interface Cliente {
  id: number | string;
  nome: string;
  telefone: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  pontoReferencia: string; // Campo obrigatório de negócio
}

export type ClienteDTO = Omit<Cliente, 'id'>;

// --- MÓDULO C: ORÇAMENTOS E VENDAS ---
export type FormaPagamento = 'A_VISTA' | 'PARCELADO' | 'COM_DESCONTO';

export interface ItemOrcamento {
  produtoId: number | string;
  nomeProduto: string;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
}

export interface OrcamentoPayload {
  clienteId: number | string;
  vendedorNome: string;
  formaPagamento: FormaPagamento;
  parcelas?: number;
  descontoPercentual?: number;
  valorTotal: number;
  itens: Array<{
    produtoId: number | string;
    quantidade: number;
    valorUnitario: number;
    subtotal: number;
  }>;
}

export interface OrcamentoResponse extends OrcamentoPayload {
  id: number | string;
  status: 'PENDENTE' | 'APROVADO';
  dataEmissao?: string;
}