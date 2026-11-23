import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ListarProdutosPage } from '../pages/products/ListarProdutosPage';
import { CadastrarProdutoPage } from '../pages/products/CadastrarProdutoPage';
import { EditarProdutoPage } from '../pages/products/EditarProdutoPage';
import { ListarClientesPage } from '../pages/clients/ListarClientesPage';
import { CadastrarClientePage } from '../pages/clients/CadastrarClientePage';
import { EditarClientePage } from '../pages/clients/EditarClientePage';
import { EmitirOrcamentoPage } from '../pages/orders/EmitirOrcamentoPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/products/consult" replace /> },
      { path: 'products/consult', element: <ListarProdutosPage /> },
      { path: 'products/register', element: <CadastrarProdutoPage /> },
      { path: 'products/:id', element: <EditarProdutoPage /> },
      { path: 'clients/consult', element: <ListarClientesPage /> },
      { path: 'clients/register', element: <CadastrarClientePage /> },
      { path: 'clients/:id', element: <EditarClientePage /> },
      { path: 'orders/new', element: <EmitirOrcamentoPage /> },
    ],
  },
]);