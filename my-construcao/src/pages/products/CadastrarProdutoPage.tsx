// src/pages/products/CadastrarProdutoPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../../components/products/ProductForm';
import { useCriarProdutoMutation } from '../../services/api';
import { ProdutoDTO } from '../../types/types';

export const CadastrarProdutoPage: React.FC = () => {
  const navigate = useNavigate();
  const [criarProduto, { isLoading }] = useCriarProdutoMutation();

  const handleCreate = async (data: ProdutoDTO) => {
    try {
      await criarProduto(data).unwrap();
      navigate('/products/consult');
    } catch {
      alert('Erro ao cadastrar o produto.');
    }
  };

  return (
    <ProductForm
      mode="create"
      onSubmit={handleCreate}
      isSubmitting={isLoading}
      onCancel={() => navigate('/products/consult')}
    />
  );
};