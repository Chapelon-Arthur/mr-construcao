import React, { useState, useEffect } from 'react';
import { ProdutoDTO } from '../../types/types';

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialValues?: ProdutoDTO;
  onSubmit: (data: ProdutoDTO) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const DEFAULT_VALUES: ProdutoDTO = {
  codigo: '',
  nome: '',
  marca: '',
  familia: 'Alvenaria',
  precoVenda: 0,
  estoqueAtual: 0,
  unidade: 'Unidade',
};

export const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProdutoDTO>(initialValues ?? DEFAULT_VALUES);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={cardStyle}>
      <h2>{mode === 'create' ? 'Cadastrar Novo Produto' : 'Editar Produto'}</h2>

      <div style={gridStyle}>
        <label style={labelStyle}>
          Nome do Produto *
          <input
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Ex: Cimento CP-II 50kg"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Código de Barras (EAN-13) *
          <input
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
            placeholder="7891234567890"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Marca *
          <input
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            required
            placeholder="Ex: Votoran"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Família *
          <select name="familia" value={formData.familia} onChange={handleChange} style={inputStyle}>
            <option value="Alvenaria">Alvenaria</option>
            <option value="Elétrica">Elétrica</option>
            <option value="Hidráulica">Hidráulica</option>
            <option value="Pintura">Pintura</option>
            <option value="Ferramentas">Ferramentas</option>
          </select>
        </label>

        <label style={labelStyle}>
          Preço de Venda (R$) *
          <input
            type="number"
            step="0.01"
            min="0"
            name="precoVenda"
            value={formData.precoVenda}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Estoque Atual *
          <input
            type="number"
            min="0"
            name="estoqueAtual"
            value={formData.estoqueAtual}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Unidade de Medida *
          <select name="unidade" value={formData.unidade} onChange={handleChange} style={inputStyle}>
            <option value="Unidade">Unidade</option>
            <option value="Saco">Saco</option>
            <option value="Metro">Metro</option>
            <option value="Litro">Litro</option>
            <option value="Caixa">Caixa</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button type="submit" disabled={isSubmitting} style={primaryBtnStyle}>
          {isSubmitting ? 'Processando...' : mode === 'create' ? 'SALVAR' : 'ATUALIZAR'}
        </button>
        <button type="button" onClick={onCancel} style={secondaryBtnStyle}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

const cardStyle: React.CSSProperties = { background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' };
const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#334155' };
const inputStyle: React.CSSProperties = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' };
const primaryBtnStyle: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' };
const secondaryBtnStyle: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' };