import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Produto,
  ProdutoDTO,
  Cliente,
  ClienteDTO,
  OrcamentoPayload,
  OrcamentoResponse,
} from '../types/types';

// Alterne entre nuvem ou local conforme necessário:
const BASE_URL = 'https://winnicius.com/tecinfo/labs/api-mr-construcao/api';
// const BASE_URL = 'http://localhost:3000/api';

export const mrConstrucaoApi = createApi({
  reducerPath: 'mrConstrucaoApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Produtos', 'Clientes', 'Orcamentos'],
  endpoints: (builder) => ({
    // ==================== MÓDULO A: PRODUTOS ====================
    listarProdutos: builder.query<Produto[], void>({
      query: () => '/produtos',
      providesTags: ['Produtos'],
    }),
    buscarProdutoPorId: builder.query<Produto, string>({
      query: (id) => `/produtos/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Produtos', id }],
    }),
    criarProduto: builder.mutation<Produto, ProdutoDTO>({
      query: (novoProduto) => ({
        url: '/produtos',
        method: 'POST',
        body: novoProduto,
      }),
      invalidatesTags: ['Produtos'],
    }),
    atualizarProduto: builder.mutation<Produto, { id: string; data: ProdutoDTO }>({
      query: ({ id, data }) => ({
        url: `/produtos/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Produtos'],
    }),
    deletarProduto: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/produtos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Produtos'],
    }),

    // ==================== MÓDULO B: CLIENTES ====================
    listarClientes: builder.query<Cliente[], void>({
      query: () => '/clientes',
      providesTags: ['Clientes'],
    }),
    buscarClientePorId: builder.query<Cliente, string>({
      query: (id) => `/clientes/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Clientes', id }],
    }),
    criarCliente: builder.mutation<Cliente, ClienteDTO>({
      query: (novoCliente) => ({
        url: '/clientes',
        method: 'POST',
        body: novoCliente,
      }),
      invalidatesTags: ['Clientes'],
    }),
    atualizarCliente: builder.mutation<Cliente, { id: string; data: ClienteDTO }>({
      query: ({ id, data }) => ({
        url: `/clientes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Clientes'],
    }),
    deletarCliente: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/clientes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clientes'],
    }),

    // ==================== MÓDULO C: ORÇAMENTOS ====================
    criarOrcamento: builder.mutation<OrcamentoResponse, OrcamentoPayload>({
      query: (orcamento) => ({
        url: '/orcamentos',
        method: 'POST',
        body: orcamento,
      }),
      invalidatesTags: ['Orcamentos', 'Produtos'],
    }),
  }),
});

export const {
  useListarProdutosQuery,
  useBuscarProdutoPorIdQuery,
  useCriarProdutoMutation,
  useAtualizarProdutoMutation,
  useDeletarProdutoMutation,
  useListarClientesQuery,
  useBuscarClientePorIdQuery,
  useCriarClienteMutation,
  useAtualizarClienteMutation,
  useDeletarClienteMutation,
  useCriarOrcamentoMutation,
} = mrConstrucaoApi;