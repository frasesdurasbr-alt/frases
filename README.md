# Frases do dia

Sistema para importar frases de arquivos TXT (uma por linha) para o Supabase e uma aplicação web que exibe até 3 frases aleatórias por dia por usuário, sem repetição.

## O que foi feito

- **Importação**: uma frase por **linha** nos arquivos TXT, sem filtros (arquivos já corrigidos manualmente).
- **Limpeza**: removidos scripts duplicados (`import_frases_env.py`, `consultar_frases.py`, `consultar_frases_env.py`, `testar_configuracao.py`). Mantidos: `import_frases.py`, `limpar_banco.py`, SQLs e pasta `TXT`.
- **App web**: roda no navegador; login/cadastro por e-mail (Supabase Auth); até 3 frases aleatórias por dia; sem repetir frases já vistas para o mesmo usuário; layout responsivo (computador e celular); cartões com fundo de imagem desfocada (Picsum.photos ou URL salva no banco).

## Pré-requisitos

- Python 3.8+ (para importador)
- Node.js 18+ (para o app web)
- Conta no [Supabase](https://supabase.com) (gratuita)

## Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, execute na ordem:
   - `criar_tabela.sql` (tabela `frases`)
   - `web/criar_tabelas_web.sql` (tabela `frases_vistas`, RLS, coluna opcional `imagem_url`)
3. Em **Authentication** > **Providers**, ative **Email**. Para **não exigir confirmação por e-mail** (útil em desenvolvimento), desmarque **"Confirm email"**; caso contrário, o usuário precisa clicar no link enviado antes de conseguir entrar.
4. Em **Settings** > **API**, copie a **URL** e a chave **anon public**.

## Importar frases (uma por linha)

Cada **linha** não vazia de um arquivo `.txt` na pasta `TXT` é importada como uma frase. Não há filtro de conteúdo.

```bash
cd Frases
pip install -r requirements.txt
cp .env.example .env
# Edite .env com SUPABASE_URL e SUPABASE_KEY (mesmas do passo acima)
python import_frases.py
# Enter ou informe a pasta dos .txt (padrão: TXT)
```

## Rodar o app web localmente

```bash
cd Frases/web
cp .env.example .env
# Edite .env com as variáveis abaixo (obrigatório para login/cadastro funcionar)
npm install
npm run dev
```

No arquivo **`Frases/web/.env`** (crie a partir de `.env.example`) defina:

- **VITE_SUPABASE_URL** = URL do projeto (ex.: `https://xxxxx.supabase.co`)
- **VITE_SUPABASE_ANON_KEY** = chave "anon public" em Settings > API do Supabase

**Importante:** depois de criar ou alterar o `.env`, **reinicie** o servidor (`Ctrl+C` e `npm run dev` de novo), pois o Vite só lê as variáveis na hora em que inicia.

Abra o endereço que o Vite mostrar (ex.: http://localhost:5173). Cadastre-se com e-mail e senha e use o app.

## Build para produção

```bash
cd Frases/web
npm run build
```

A pasta `dist/` pode ser servida por qualquer host estático (veja hospedagem abaixo).

## Melhor opção de hospedagem (recomendada)

**Vercel** é a melhor opção para este projeto:

- Plano gratuito generoso e estável para sites estáticos
- Integração nativa com Vite/React: só conectar o repositório e informar a pasta `Frases/web`
- Variáveis de ambiente no painel (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
- HTTPS e CDN globais sem configuração
- Deploy automático a cada push no Git

**Passos rápidos:** [vercel.com](https://vercel.com) → "Add New" → "Project" → importe o repositório → **Root Directory**: `Frases/web` → **Build Command**: `npm run build` → **Output Directory**: `dist` → adicione as variáveis de ambiente → Deploy.  
**Guia completo:** veja **[web/DEPLOY_VERCEL.md](web/DEPLOY_VERCEL.md)** para o passo a passo detalhado (GitHub, variáveis, Supabase Redirect URLs).

---

## Outras opções de hospedagem gratuita

A aplicação é um **front estático** (HTML/CSS/JS) que usa **Supabase** (banco + autenticação). Você só precisa hospedar os arquivos da pasta `dist/` após o build.

### Outras opções

| Serviço | Uso | Observação |
|--------|-----|------------|
| **Vercel** | Deploy do projeto (conecte o repositório Git) | Grátis, HTTPS, ideal para React/Vite. [vercel.com](https://vercel.com) |
| **Netlify** | Deploy do projeto ou arrastar a pasta `dist` | Grátis, HTTPS. [netlify.com](https://netlify.com) |
| **Cloudflare Pages** | Deploy via Git ou upload | Grátis, CDN global. [pages.cloudflare.com](https://pages.cloudflare.com) |
| **Render** (Static Site) | Deploy via Git | Grátis. [render.com](https://render.com) |
| **Supabase** | Já usado para banco e auth | Não hospeda o front; use um dos acima para o app. |

### Variáveis de ambiente na hospedagem

No painel da Vercel/Netlify/Render/Cloudflare Pages, configure:

- `VITE_SUPABASE_URL` = URL do projeto Supabase  
- `VITE_SUPABASE_ANON_KEY` = chave anon public do Supabase  

(Os nomes com `VITE_` são necessários para o Vite expor essas variáveis no build.)

### Exemplo rápido na Vercel

1. Suba o projeto (incluindo a pasta `Frases/web`) para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), “Add New” > “Project” e importe o repositório.
3. **Root Directory**: defina `Frases/web`.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
7. Deploy. O site ficará em `https://seu-projeto.vercel.app`.

## Imagens de fundo

- Por padrão, cada cartão usa uma imagem do [Picsum.photos](https://picsum.photos) (seed pelo ID da frase), gratuita e sem necessidade de cadastro.
- Se quiser imagem fixa por frase: preencha a coluna `imagem_url` na tabela `frases` no Supabase (URL direta da imagem). O app usa essa URL quando existir.
- Para imagens sob licença livre por frase (ex.: Unsplash/Pexels), seria necessário um backend ou Edge Function para buscar por palavra-chave; o README e o schema já deixam preparado o uso de `imagem_url`.

## Estrutura do projeto

```
Frases/
├── TXT/                    # Arquivos .txt (uma frase por linha)
├── import_frases.py         # Importador (uma frase por linha)
├── limpar_banco.py          # Limpa a tabela frases no Supabase
├── criar_tabela.sql         # Cria tabela frases
├── limpar_tabela.sql        # TRUNCATE frases (no SQL Editor)
├── requirements.txt
├── .env.example
├── web/
│   ├── criar_tabelas_web.sql  # frases_vistas, RLS, imagem_url
│   ├── package.json
│   ├── .env.example          # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── lib/supabase.js
│       └── components/
│           ├── Layout.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Home.jsx
│           └── FraseCard.jsx
└── README.md
```

## Problema: "Failed to fetch" no cadastro ou login

Esse erro aparece quando o navegador **não consegue falar com o Supabase**. As causas mais comuns:

1. **Arquivo `.env` não configurado ou incorreto**  
   Crie `Frases/web/.env` (copie de `.env.example`) e preencha com a **URL** e a chave **anon public** do seu projeto no Supabase (Settings > API). Não use aspas nos valores. Depois **reinicie o servidor** (`npm run dev`).

2. **Projeto Supabase pausado**  
   No plano gratuito, projetos sem uso podem ser pausados. Entre no [dashboard do Supabase](https://supabase.com/dashboard), abra o projeto e clique em "Restore project" se aparecer pausado.

3. **URL ou chave com erro de digitação**  
   A URL deve ser algo como `https://abcdefgh.supabase.co` (sem barra no final). A chave é longa e começa com `eyJ...`. Copie e cole direto do painel do Supabase.

Depois de corrigir o `.env`, sempre reinicie o `npm run dev`.

### "Email not confirmed" ao entrar

Se você já clicou no link de confirmação e mesmo assim aparece "E-mail ainda não confirmado", tente **entrar de novo** (às vezes o Supabase demora um pouco para atualizar). Use também o botão **"Reenviar e-mail de confirmação"** na tela de login para receber um novo link. Para não exigir confirmação em desenvolvimento, desative **Confirm email** em Supabase → Authentication → Providers → Email.

### "column frases.imagem_url does not exist"

O app foi ajustado para **não depender** dessa coluna: as frases são carregadas sem ela e o fundo dos cartões usa imagens gratuitas (Picsum). Se quiser guardar uma URL de imagem por frase no futuro, execute no SQL Editor do Supabase o script **`web/criar_tabelas_web.sql`** (ele adiciona a coluna `imagem_url` e cria a tabela `frases_vistas`).

---

## Resumo

- **Importação**: uma frase por linha nos TXT, sem filtros.  
- **App**: navegador, login por e-mail, até 3 frases/dia, sem repetir para o mesmo usuário, layout responsivo e fundo com imagem desfocada.  
- **Hospedagem**: use um serviço gratuito (Vercel, Netlify, Cloudflare Pages ou Render) para o front e mantenha o Supabase para banco e autenticação.
