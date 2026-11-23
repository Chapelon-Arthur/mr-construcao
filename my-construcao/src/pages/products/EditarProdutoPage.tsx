// src/pages/products/EditarProdutoPage.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '../../components/products/ProductForm';
import { useBuscarProdutoPorIdQuery, useAtualizarProdutoMutation } from '../../services/api';
import { ProdutoDTO } from '../../types/types';

export const EditarProdutoPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: produtoAtual, isLoading: isFetching, isError } = useBuscarProdutoPorIdQuery(id);
  const [atualizarProduto, { isLoading: isUpdating }] = useAtualizarProdutoMutation();

  const handleUpdate = async (data: ProdutoDTO) => {
    try {
      await atualizarProduto({ id, data }).unwrap();
      navigate('/products/consult');
    } catch {
      alert('Erro ao atualizar o produto.');
    }
  };

  if (isFetching) return <p>Carregando dados do produto...</p>;
  if (isError || !produtoAtual) return <p style={{ color: 'red' }}>Produto não encontrado.</p>;

  return (
    <ProductForm
      mode="edit"
      initialValues={produtoAtual}
      onSubmit={handleUpdate}
      isSubmitting={isUpdating}
      onCancel={() => navigate('/products/consult')}
    />
  );
};