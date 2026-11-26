# NEXORA 3D — Loja virtual com painel administrativo

Loja de peças personalizadas em impressão 3D. Site estático (HTML, CSS e JavaScript puro), sem build, pronto para a **Vercel**, com **Firebase** (Authentication + Firestore).

- **Loja pública** (`/`): catálogo, carrinho, Pix com QR Code, pedido por WhatsApp e Gmail, desconto de fidelidade, cancelamento e chat NEXORA DÚVIDAS. Produtos, textos e banner vêm do Firestore e atualizam sozinhos.
- **Painel** (`/admin/`): login por e-mail e senha, dashboard, produtos (adicionar, editar, excluir, preço, imagem, ativar/desativar), pedidos (ver cliente e itens, mudar status, concluir) e personalização da loja (textos, banner, contato).

## Estrutura

```
public/                  <- publicado pela Vercel
├── index.html           loja
├── css/style.css
├── js/
│   ├── config.js        WhatsApp, e-mail e Pix padrão
│   ├── firebase-config.js, firebase.js   conexão com o Firebase
│   ├── app.js, extras.js, cart-bar.js, cancel.js   loja, carrinho, Pix, desconto, bot
│   └── store.js         produtos, configurações e gravação de pedidos no Firestore
└── admin/               painel (index.html, admin.js, admin.css)
firestore.rules          regras de segurança do banco
vercel.json, package.json
```

## Configurar o Firebase (faça na ordem)

Abra o [Console do Firebase](https://console.firebase.google.com) e entre no projeto **nexora3d-82971**.

### 1. Ativar o login
1. Menu da esquerda → **Build (Criação) → Authentication** → aba **Sign-in method (Método de login)**.
2. Clique em **E-mail/senha** → ative a primeira chave → **Salvar**. (Deixe **Anônimo** ativado também: é o que permite o cliente enviar o pedido sem criar conta.)

### 2. Criar a sua conta de proprietário
1. Em Authentication, aba **Users (Usuários)** → **Add user (Adicionar usuário)**.
2. Digite o seu e-mail e uma senha forte → **Add user**. Não existe tela de cadastro no site: ninguém consegue criar conta de administrador pelo app.
3. Na lista, copie o valor da coluna **User UID (UID do usuário)**.

### 3. Cadastrar o primeiro proprietário (procedimento seguro)
1. Menu → **Firestore Database** (crie o banco, se ainda não existir, em modo de produção).
2. Aba **Data (Dados)** → **Start collection (Iniciar coleção)** → ID da coleção: `admins` → **Next**.
3. **ID do documento: cole o UID copiado**. Adicione um campo `ativo`, tipo `boolean`, valor `true` → **Save**.

Pronto: só quem tem o UID cadastrado aí vira administrador. As regras proíbem criar ou alterar `admins` pelo app, então ninguém (nem anônimo, nem cliente) consegue se promover. Para adicionar outro administrador, repita o passo 2 e o 3 com o UID dele.

> Se esquecer o UID: entre em `/admin/` com a conta; a tela "Sem acesso" mostra o UID para copiar.

### 4. Publicar as regras de segurança
1. Firestore Database → aba **Rules (Regras)**.
2. Apague tudo, cole o conteúdo do arquivo `firestore.rules` e clique em **Publish (Publicar)**.

### 5. Autorizar o domínio do site
Authentication → **Settings (Configurações)** → **Authorized domains (Domínios autorizados)** → **Add domain** e adicione o endereço da Vercel (ex.: `3dsite-ashy.vercel.app`) e o domínio próprio, se tiver.

### 6. (Opcional) E-mail de recuperação de senha em português
Authentication → **Templates (Modelos)** → **Password reset (Redefinição de senha)** → lápis → altere o idioma para **Português (Brasil)**.

## Publicar (GitHub + Vercel)
1. Suba o **conteúdo** desta pasta para um repositório do GitHub (o `vercel.json` precisa ficar na raiz).
2. Na Vercel: **Add New → Project** → escolha o repositório → **Deploy** (sem mudar nada).
3. Cada novo commit no GitHub publica sozinho.

## Primeiro uso do painel
1. Abra `https://seu-site/admin/` (ou o link **Área do administrador** no rodapé da loja) e entre com e-mail e senha.
2. Em **Produtos**, toque em **Importar os 9 produtos padrão** e depois edite preços, imagens e descrições.
3. Em **Loja**, ajuste textos, banner e contato. Os pedidos dos clientes aparecem em **Pedidos** em tempo real.

## Como a segurança funciona
- O painel só abre para quem está em `admins`, mas **a proteção real está nas regras do Firestore**: produtos e configurações só são gravados por administrador, pedidos só são lidos por administrador, e o cliente só consegue **criar** o próprio pedido.
- A administradora precisa ter entrado por **e-mail/senha** (sessão anônima nunca vale como admin).
- O `apiKey` do Firebase no código **não é segredo**; quem protege os dados são as regras. Nenhuma senha está no código.
- Se você usava a versão anterior (dono por aparelho), as coleções `config` e `editors` do Firestore não são mais usadas e podem ser apagadas.

## Imagens
As imagens são reduzidas no navegador e salvas dentro do próprio Firestore (nada de Firebase Storage, que hoje exige plano pago). Funciona bem para fotos de produto e banner; para arquivos grandes, use o campo de link (https://).

## Limites
- O Pix não é confirmado automaticamente: confira o dinheiro e mude o status do pedido para **Pago**.
- O WhatsApp e o Gmail abrem com a mensagem pronta; o cliente toca em enviar. O pedido também fica salvo no painel.
- Pedidos cancelados pelo cliente chegam por WhatsApp; mude o status no painel.
- O código Pix fica em `public/js/config.js`.

## Rodar no computador
```bash
npm run dev
```
Abre em http://localhost:3000 (Node 18+). Adicione `localhost` aos domínios autorizados do Firebase (já vem por padrão).
