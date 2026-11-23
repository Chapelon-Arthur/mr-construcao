import React, { useState, useEffect } from 'react';
import { ClienteDTO } from '../../types/types';

interface ClientFormProps {
  mode: 'create' | 'edit';
  initialValues?: ClienteDTO;
  onSubmit: (data: ClienteDTO) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const DEFAULT_CLIENT: ClienteDTO = {
  nome: '',
  telefone: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  cep: '',
  pontoReferencia: '',
};

export const ClientForm: React.FC<ClientFormProps> = ({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ClienteDTO>(initialValues ?? DEFAULT_CLIENT);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2>{mode === 'create' ? 'Cadastrar Novo Cliente' : 'Editar Cadastro do Cliente'}</h2>

      <h3 style={{ fontSize: '15px', color: '#475569', marginTop: '16px' }}>Dados Pessoais</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <label style={labelStyle}>
          Nome Completo *
          <input name="nome" value={formData.nome} onChange={handleChange} required style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Telefone / WhatsApp *
          <input name="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(83) 99999-9999" style={inputStyle} />
        </label>
      </div>

      <h3 style={{ fontSize: '15px', color: '#475569', marginTop: '24px' }}>Endereço de Entrega (Canteiro de Obras)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <label style={labelStyle}>
          CEP *
          <input name="cep" value={formData.cep} onChange={handleChange} required placeholder="58400-000" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Rua / Logradouro *
          <input name="rua" value={formData.rua} onChange={handleChange} required style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Número *
          <input name="numero" value={formData.numero} onChange={handleChange} required style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Bairro *
          <input name="bairro" value={formData.bairro} onChange={handleChange} required style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Cidade *
          <input name="cidade" value={formData.cidade} onChange={handleChange} required style={inputStyle} />
        </label>
      </div>

      <div style={{ marginTop: '16px' }}>
        <label style={labelStyle}>
          Ponto de Referência para Descarregamento (Obrigatório) *
          <input
            name="pontoReferencia"
            value={formData.pontoReferencia}
            onChange={handleChange}
            required
            placeholder='Ex: "Próximo ao depósito central", "Ao lado do posto de saúde"'
            style={inputStyle}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
          {isSubmitting ? 'Processando...' : mode === 'create' ? 'SALVAR' : 'ATUALIZAR'}
        </button>
        <button type="button" onClick={onCancel} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#334155' };
const inputStyle: React.CSSProperties = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' };