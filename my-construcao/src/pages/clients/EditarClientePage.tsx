// src/pages/clients/EditarClientePage.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientForm } from '../../components/clients/ClientForm';
import { useBuscarClientePorIdQuery, useAtualizarClienteMutation } from '../../services/api';
import { ClienteDTO } from '../../types/types';

export const EditarClientePage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: clienteAtual, isLoading: isFetching, isError } = useBuscarClientePorIdQuery(id);
  const [atualizarCliente, { isLoading: isUpdating }] = useAtualizarClienteMutation();

  const handleUpdate = async (data: ClienteDTO) => {
    try {
      await atualizarCliente({ id, data }).unwrap();
      navigate('/clients/consult');
    } catch {
      alert('Erro ao atualizar cliente.');
    }
  };

  if (isFetching) return <p>Carregando dados do cliente...</p>;
  if (isError || !clienteAtual) return <p style={{ color: 'red' }}>Cliente não encontrado.</p>;

  return (
    <ClientForm
      mode="edit"
      initialValues={clienteAtual}
      onSubmit={handleUpdate}
      isSubmitting={isUpdating}
      onCancel={() => navigate('/clients/consult')}
    />
  );
};