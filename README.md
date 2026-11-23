Arthur Kauan Barbosa da Silva
# 🏗️ Mr. Construção — Sistema de Gestão de Materiais de Construção

Aplicação front-end desenvolvida em **React + TypeScript** para gerenciamento completo (CRUD) de produtos, clientes com endereço de entrega e emissão de orçamentos/vendas da loja **Mr. Construção**.

---

## 🚀 Tecnologias Utilizadas

* **React 18+** & **TypeScript** (tipagem estrita, sem uso de `any`)
* **Vite** (ambiente de desenvolvimento e bundler)
* **Redux Toolkit & RTK Query** (gerenciamento de estado global, cache automatizado e invalidação de tags)
* **React Router DOM** (roteamento aninhado utilizando `createBrowserRouter` e `<Outlet />`)
* **Tailwind CSS** (estilização responsiva e componentes de interface)
* **Lucide React** (iconografia)

---

## 📦 Funcionalidades e Módulos

### 1. Módulo A — Gestão de Produtos (`/products`)
* **Listagem e Consulta (`/products/consult`):** Exibição de produtos cadastrados com código, nome, categoria, unidade de medida, preço unitário e quantidade em estoque.
* **Cadastro (`/products/register`):** Inclusão de novos itens no catálogo com validação de campos obrigatórios.
* **Edição (`/products/:id`):** Atualização de dados e estoque reaproveitando o componente `ProductForm`.
* **Exclusão:** Remoção de registros com atualização automática da lista via RTK Query (`providesTags` / `invalidatesTags`).

### 2. Módulo B — Gestão de Clientes (`/clients`)
* **Listagem e Consulta (`/clients/consult`):** Visualização de clientes (Pessoa Física ou Jurídica) e seus respectivos contatos.
* **Cadastro (`/clients/register`):** Formulário unificado contendo dados cadastrais (Nome/Razão Social, CPF/CNPJ, Telefone, E-mail) e endereço completo de entrega (CEP, Logradouro, Número, Bairro, Cidade e UF).
* **Edição (`/clients/:id`):** Alteração de dados pessoais e endereço reaproveitando o componente `ClientForm`.
* **Exclusão:** Remoção de clientes com sincronização instantânea da interface.

### 3. Módulo C — Emissão de Orçamentos (`/orders/new`)
* Seleção dinâmica de cliente cadastrado e adição de múltiplos produtos ao carrinho do orçamento.
* Cálculo automático de subtotais por item e valor total do pedido.
* Seleção da forma de pagamento e envio do payload estruturado para a API.

---

## 🗂️ Arquitetura do Projeto

O projeto segue o princípio **DRY (Don't Repeat Yourself)**, separando formulários reutilizáveis, camadas de serviço, tipagens e páginas de rota:

```text
src/
├── components/
│   ├── clients/
│   │   └── ClientForm.tsx        # Formulário reutilizável (Cadastro e Edição de Clientes)
│   ├── layout/
│   │   └── MainLayout.tsx        # Estrutura principal com barra de navegação e <Outlet/>
│   └── products/
│       └── ProductForm.tsx       # Formulário reutilizável (Cadastro e Edição de Produtos)
├── pages/
│   ├── clients/
│   │   ├── CadastrarClientePage.tsx
│   │   ├── EditarClientePage.tsx
│   │   └── ListarClientesPage.tsx
│   ├── orders/
│   │   └── EmitirOrcamentoPage.tsx
│   └── products/
│       ├── CadastrarProdutoPage.tsx
│       ├── EditarProdutoPage.tsx
│       └── ListarProdutosPage.tsx
├── routes/
│   └── AppRoutes.tsx             # Definição centralizada das rotas
├── services/
│   └── api.ts                    # Configuração do RTK Query (endpoints, queries e mutations)
├── store/
│   └── store.ts                  # Configuração da Redux Store
├── types/
│   └── types.ts                  # Interfaces e DTOs (Produto, Cliente, Endereco, Orcamento)
├── App.tsx
└── main.tsx
