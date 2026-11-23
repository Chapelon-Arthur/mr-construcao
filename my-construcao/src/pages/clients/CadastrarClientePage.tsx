// src/pages/clients/CadastrarClientePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientForm } from '../../components/clients/ClientForm';
import { useCriarClienteMutation } from '../../services/api';
import { ClienteDTO } from '../../types/types';

export const CadastrarClientePage: React.FC = () => {
  const navigate = useNavigate();
  const [criarCliente, { isLoading }] = useCriarClienteMutation();

  const handleCreate = async (data: ClienteDTO) => {
    try {
      await criarCliente(data).unwrap();
      navigate('/clients/consult');
    } catch {
      alert('Erro ao cadastrar cliente.');
    }
  };

  return (
    <ClientForm
      mode="create"
      onSubmit={handleCreate}
      isSubmitting={isLoading}
      onCancel={() => navigate('/clients/consult')}
    />
  );
};