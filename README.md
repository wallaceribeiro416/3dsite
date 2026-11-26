# NEXORA 3D

Loja online de peças personalizadas feitas em impressora 3D. Site estático (HTML, CSS e JavaScript puro), sem etapa de build, pronto para a **Vercel**.

**O que o site tem**
- Abas (Início, Produtos, Pedido), catálogo com filtros e carrinho
- Pagamento por **Pix** com QR Code gerado com o valor do carrinho
- Pedido enviado por **WhatsApp** e **Gmail**
- Desconto de fidelidade (5% por pedido, até 15%) e dados do cliente salvos no aparelho
- Cancelamento de pedido e chat automático **NEXORA DÚVIDAS**
- **Área do editor** (rodapé): dono e editores autorizados por aparelho cadastram produtos e preços (Firebase)

## Estrutura

```
nexora3d/
├── public/                 <- o site (é isto que a Vercel publica)
│   ├── index.html
│   ├── favicon.svg
│   ├── css/style.css
│   └── js/
│       ├── config.js           <- WhatsApp, e-mail e Pix (edite aqui)
│       ├── firebase-config.js  <- dados do seu projeto Firebase
│       ├── app.js              <- catálogo, carrinho, pedido e Pix
│       ├── extras.js           <- desconto, dados salvos e chat de dúvidas
│       ├── cart-bar.js         <- botão "Prosseguir com a compra"
│       ├── cancel.js           <- cancelamento de pedido
│       └── admin.js            <- Área do editor (Firebase)
├── firestore.rules         <- regras de segurança do banco
├── vercel.json             <- configuração da Vercel
├── package.json
└── README.md
```

## 1. Configurar o Firebase (uma vez)

1. No [console do Firebase](https://console.firebase.google.com), abra o projeto e crie o **Firestore Database**.
2. Em **Regras**, apague o conteúdo, cole o arquivo `firestore.rules` e clique em **Publicar**.
3. Em **Authentication → Método de login**, ative **Anônimo**.
4. O arquivo `public/js/firebase-config.js` já traz os dados do projeto `nexora3d-82971`. Para usar outro projeto, troque os valores.

## 2. Publicar

1. Extraia o ZIP.
2. No GitHub, crie um repositório novo (pode ser privado).
3. Clique em **Add file → Upload files** e envie o **conteúdo** da pasta extraída (arrastando `public`, `vercel.json`, `package.json`, `firestore.rules`, `README.md` e `.gitignore`). O `vercel.json` precisa ficar na raiz do repositório. Se `.gitignore` não aparecer no seu sistema, pode ignorá-lo.
4. Na [Vercel](https://vercel.com), clique em **Add New → Project**, escolha o repositório e clique em **Deploy**. Não precisa mudar nenhuma configuração: o `vercel.json` já define a pasta `public` e desliga o build.
5. Com o link pronto (`https://seu-projeto.vercel.app`), volte ao Firebase em **Authentication → Configurações → Domínios autorizados** e adicione esse domínio (e o seu domínio próprio, se tiver). Sem isso o login anônimo falha.

## 3. Primeiro acesso (importante)

Antes de divulgar o link:
1. Abra o site no **seu celular**, role até o rodapé e toque em **Área do editor**.
2. Toque em **Tornar este celular o dono**. O primeiro aparelho a fazer isso vira o dono.
3. Toque em **Salvar produtos padrão** e depois edite nomes, preços e descrições, ou use **Adicionar produto**.

**Autorizar outro editor:** a pessoa abre a Área do editor, digita o nome do aparelho e pede acesso. O pedido aparece para você (🔴 no rodapé) e você toca em **Autorizar** ou **Recusar**.

## Rodar no computador (opcional)

```bash
npm run dev
```

Abre em http://localhost:3000. Precisa do Node 18 ou mais novo.

## Mudar WhatsApp, e-mail ou Pix

Edite `public/js/config.js`, faça commit no GitHub e a Vercel publica sozinha.

## Limites que você precisa conhecer

- **O pagamento não é confirmado automaticamente.** O cliente paga o Pix e envia o comprovante pelo WhatsApp; você confere o dinheiro antes de produzir. Confirmação automática exige um serviço de pagamento (Mercado Pago, Efí etc.) e um servidor.
- **O envio por WhatsApp e Gmail abre o app com a mensagem pronta**, e o cliente toca em enviar.
- **Desconto e dados salvos** ficam só no aparelho do cliente.
- **Preços são calculados no navegador.** Confira sempre o valor recebido no Pix.
- Se o dono limpar os dados do navegador, perde o acesso de dono. Para recuperar, apague o documento `config/owner` no console do Firebase e refaça o passo 3.
