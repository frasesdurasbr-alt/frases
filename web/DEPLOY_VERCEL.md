# Colocar o projeto Frases do dia ONLINE na Vercel

Siga estes passos para publicar o app na Vercel. O front fica na Vercel; o banco e o login continuam no Supabase (já configurado).

---

## 1. Deixar o projeto no GitHub (ou GitLab / Bitbucket)

Se ainda não tiver o projeto em um repositório:

1. Crie um repositório no [GitHub](https://github.com/new) (ex.: `frases-do-dia`).
2. Na pasta **raiz** do seu projeto (onde está a pasta `Frases`), abra o terminal e execute:

```bash
git init
git add .
git commit -m "Projeto Frases do dia"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/frases-do-dia.git
git push -u origin main
```

Substitua `SEU_USUARIO/frases-do-dia` pela URL real do seu repositório.

---

## 2. Conectar o repositório na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login (pode usar a conta GitHub).
2. Clique em **“Add New…”** → **“Project”**.
3. **Import** o repositório onde está o projeto (ex.: `frases-do-dia`).
4. Se pedir, autorize a Vercel a acessar a organização/repositório no GitHub.

---

## 3. Configurar o projeto na Vercel

Na tela de configuração do projeto:

| Campo | Valor |
|--------|--------|
| **Framework Preset** | Vite (a Vercel costuma detectar; se não, escolha Vite). |
| **Root Directory** | **`Frases/web`** — clique em “Edit”, marque “Include subdirectory” e digite `Frases/web`. |
| **Build Command** | `npm run build` (geralmente já vem preenchido). |
| **Output Directory** | `dist` (geralmente já vem preenchido). |
| **Install Command** | `npm install` (padrão). |

Não altere **Environment Variables** ainda; faremos no próximo passo.

---

## 4. Variáveis de ambiente (Supabase)

O app precisa da URL e da chave do Supabase no build.

1. Na mesma tela (ou em **Settings** → **Environment Variables** do projeto), adicione:

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | A **URL** do seu projeto (ex.: `https://xxxxx.supabase.co`). Pegue em: [Supabase](https://supabase.com/dashboard) → seu projeto → **Settings** → **API** → Project URL. |
| `VITE_SUPABASE_ANON_KEY` | A chave **anon public**. Em Settings → API → Project API keys → `anon` `public`. |

2. Marque o ambiente **Production** (e, se quiser, Preview).
3. Salve.

---

## 5. Fazer o deploy

1. Clique em **“Deploy”**.
2. Aguarde o build. Se der erro, confira:
   - **Root Directory** está mesmo como `Frases/web`.
   - **Build Command**: `npm run build`.
   - **Output Directory**: `dist`.
   - As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão preenchidas.

3. Quando terminar, a Vercel mostra a URL do site (ex.: `https://frases-do-dia.vercel.app`).

---

## 6. Configurar o Supabase para a URL da Vercel (login)

Para o login por e-mail funcionar no site publicado:

1. No [Supabase](https://supabase.com/dashboard), abra seu projeto.
2. Vá em **Authentication** → **URL Configuration**.
3. Em **Redirect URLs**, adicione a URL do seu app na Vercel, por exemplo:
   - `https://seu-projeto.vercel.app`
   - `https://seu-projeto.vercel.app/**`
4. Salve.

Assim o Supabase aceita redirecionamentos vindos do seu domínio na Vercel.

---

## 7. Atualizações futuras

Sempre que fizer **push** na branch conectada (ex.: `main`), a Vercel fará um novo deploy automático. Não é preciso configurar nada a mais.

---

## Resumo rápido

1. Projeto no GitHub (ou outro Git).
2. Vercel → Add New → Project → importar repositório.
3. **Root Directory**: `Frases/web` | **Build**: `npm run build` | **Output**: `dist`.
4. Variáveis: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
5. Deploy.
6. Supabase → Authentication → URL Configuration → adicionar a URL da Vercel em Redirect URLs.

Pronto: mesmo dia = mesmas 3 frases ao refazer login; no dia seguinte = novas frases; e o app fica online na Vercel.
