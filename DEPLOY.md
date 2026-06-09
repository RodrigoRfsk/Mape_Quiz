# Deploy — quiz.fontanela.com.br (stack gerenciada)

Sem VPS. A stack usa serviços gerenciados, todos com plano inicial gratuito:

- **Banco:** Neon (PostgreSQL serverless)
- **App (API + build do React):** Render (deploy via `Dockerfile` deste repo)
- **E-mail (cadência por perfil):** n8n Cloud
- **Domínio:** `quiz.fontanela.com.br` (CNAME na Hostinger → Render)

O app serve a API e o site na mesma origem, então o front fala com `/api/...`
(sem CORS, sem `VITE_API_URL` extra — já vai embutido no build).

---

## Passo 1 — Banco no Neon

1. Crie conta em https://neon.tech → **New Project** (região mais perto do Brasil).
2. Copie a **connection string** (Pooled). Formato:
   ```
   postgres://USER:PASSWORD@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Guarde essa string — é o `DATABASE_URL`. (O `?sslmode=require` é importante.)

> As tabelas (`leads`, `quiz_sessions`) são criadas automaticamente no deploy do
> Render pelo `pnpm db:push` (pré-deploy). Não precisa rodar nada manual no Neon.

---

## Passo 2 — App no Render

1. Crie conta em https://render.com e conecte o GitHub (`RodrigoRfsk/Mape_Quiz`).
2. **New → Blueprint** e aponte para o repo. O Render lê o `render.yaml` e cria o
   web service `mape-quiz` (runtime Docker).
   - Alternativa manual: **New → Web Service → Docker**, branch de produção.
3. Em **Environment**, defina:
   - `DATABASE_URL` = a string do Neon (Passo 1).
   - `N8N_WEBHOOK_URL` = deixe em branco por enquanto (preenche no Passo 3).
   - `NODE_ENV` = `production` (já vem do blueprint).
   - Não defina `PORT` — o Render injeta automaticamente e o app usa.
4. **Create / Deploy**. O Render builda o Dockerfile, roda `pnpm db:push`
   (cria as tabelas no Neon) e sobe o serviço. Você recebe uma URL
   `https://mape-quiz.onrender.com`.

> Plano free do Render "dorme" após ~15 min sem acesso (cold start no 1º hit).
> Para tirar o sleep, suba para o plano pago do web service.

---

## Passo 3 — n8n Cloud (e-mail)

1. Crie conta em https://n8n.io (n8n Cloud).
2. **Import** → suba `integrations/n8n/mape-cadence.workflow.json`.
3. Crie a credencial **SMTP real** (seu provedor de e-mail) e associe em todos os
   nós de e-mail e no "Notificar SDR". Troque os `SEU_DOMINIO`/`sdr@`.
4. **Ative** o workflow. Abra o nó **Webhook** e copie a *Production URL*
   (algo como `https://SEU-ESPACO.app.n8n.cloud/webhook/mape-lead`).
5. Volte ao Render → defina `N8N_WEBHOOK_URL` com essa URL → **Save** (redeploy).

> Sem `N8N_WEBHOOK_URL`, o lead é salvo normalmente no Neon — só não dispara o
> e-mail. Então dá para validar o Passo 2 antes de ter o n8n pronto.

---

## Passo 4 — Domínio na Hostinger

1. No Render, no serviço → **Settings → Custom Domains → Add** `quiz.fontanela.com.br`.
   O Render mostra um alvo CNAME (ex.: `mape-quiz.onrender.com`).
2. No painel de DNS da Hostinger (domínio `fontanela.com.br`), crie:
   ```
   Tipo:  CNAME
   Nome:  quiz
   Valor: mape-quiz.onrender.com   (o alvo que o Render mostrou)
   TTL:   3600
   ```
3. Aguarde a propagação. O Render emite o HTTPS automaticamente.

Resultado: `https://quiz.fontanela.com.br` servindo o quiz, sem tocar no site
principal.

---

## Verificação

- Acesse `https://quiz.fontanela.com.br`, responda o quiz e finalize.
- **Banco (Neon):** no SQL Editor do Neon:
  ```sql
  select name, email, profile from leads order by created_at desc limit 5;
  select last_question_id, count(*) from quiz_sessions group by last_question_id;
  ```
- **E-mail:** confira as *Executions* no n8n Cloud e a caixa de entrada.

---

## Atualizações

Com `autoDeploy: true`, cada merge na branch conectada ao Render dispara um novo
build (e o `pnpm db:push` de pré-deploy mantém o schema em dia). Para forçar:
**Manual Deploy** no painel do Render.

---

## Apêndice — alternativa em VPS (Docker)

Se um dia houver um VPS, o repo já tem tudo para rodar tudo junto:
`Dockerfile`, `docker-compose.prod.yml` (app + postgres + n8n + Caddy/HTTPS),
`Caddyfile` e `.env.deploy.example`. Resumo: apontar um registro **A**
`quiz → IP`, preencher `.env` (raiz) e `server/.env`, e
`docker compose -f docker-compose.prod.yml up -d --build`.
