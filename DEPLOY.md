# Deploy — quiz.fontanela.com.br

Stack: app Node (Express servindo a API + o build do React) + PostgreSQL + n8n,
tudo via Docker, com Caddy fazendo HTTPS automático.

---

## 0. Descobrir seu plano na Hostinger

No hPanel da Hostinger, veja no topo / no menu lateral o tipo do produto:

- **VPS** (ex.: "VPS", "KVM 1/2") → você tem acesso root/SSH. **É o caminho deste guia.**
- **Hospedagem (compartilhada / cPanel / "Hospedagem de Sites")** → NÃO roda Node
  nem Postgres persistente. Nesse caso veja a seção "Alternativa sem VPS".

> Recomendado: um VPS pequeno (KVM 1 já roda tudo). É onde este guia opera.

---

## 1. DNS (subdomínio)

No painel de DNS da Hostinger, crie um registro apontando o subdomínio para o IP do VPS:

```
Tipo: A
Nome: quiz
Valor: <IP_DO_SEU_VPS>
TTL: 3600
```

Resultado: `quiz.fontanela.com.br` → seu VPS. (Não mexe no site principal.)

---

## 2. Preparar o VPS

```bash
ssh root@<IP_DO_SEU_VPS>
# instalar Docker + plugin compose (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh

git clone https://github.com/RodrigoRfsk/Mape_Quiz.git
cd Mape_Quiz
```

---

## 3. Variáveis de ambiente

São dois arquivos:

### a) `.env` (raiz) — usado pelo docker compose (banco)
Copie de `.env.deploy.example`:
```bash
cp .env.deploy.example .env
```
```
POSTGRES_USER=mape
POSTGRES_PASSWORD=<senha-forte>
POSTGRES_DB=mape_quiz
```

### b) `server/.env` — usado pela aplicação
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgres://mape:<senha-forte>@db:5432/mape_quiz
N8N_WEBHOOK_URL=http://n8n:5678/webhook/mape-lead
```
> `DATABASE_URL` precisa bater com o `.env` da raiz (mesmo user/senha/db); o host
> é `db` (nome do serviço no compose). `N8N_WEBHOOK_URL` usa `n8n` (rede interna).
> Não defina `VITE_API_URL`: o build já usa `/api/leads` (mesma origem).

---

## 4. Subir

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Criar as tabelas no banco (uma vez):
```bash
docker compose -f docker-compose.prod.yml exec app pnpm db:push
```

Pronto: `https://quiz.fontanela.com.br` já responde (Caddy emite o certificado
HTTPS automaticamente no primeiro acesso).

---

## 5. Configurar o n8n (e-mails)

O n8n fica acessível só localmente (porta 5678 no localhost do VPS). Para abrir a
UI com segurança, faça um túnel SSH a partir da sua máquina:

```bash
ssh -L 5678:localhost:5678 root@<IP_DO_SEU_VPS>
```
Abra `http://localhost:5678` no navegador e:

1. **Import from File** → `integrations/n8n/mape-cadence.workflow.json`.
2. Crie a credencial **SMTP real** (provedor de e-mail) e associe em todos os nós
   de e-mail + no "Notificar SDR". Troque os `SEU_DOMINIO`/`sdr@`.
3. **Ative** o workflow (toggle no topo). O caminho do webhook
   (`/webhook/mape-lead`) é o que o backend chama em `N8N_WEBHOOK_URL`.

> Sem `N8N_WEBHOOK_URL` configurada (ou n8n inativo), o lead é salvo normalmente —
> apenas não dispara o e-mail.

---

## 6. Verificar

- Acesse `https://quiz.fontanela.com.br`, responda o quiz e finalize.
- Banco: `docker compose -f docker-compose.prod.yml exec db psql -U mape -d mape_quiz -c "select name,email,profile from leads;"`
- E-mails: confira no painel do provedor SMTP / nas Executions do n8n.

---

## Atualizar (deploy de novas versões)

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec app pnpm db:push
```

---

## Alternativa sem VPS (hospedagem compartilhada)

A compartilhada não roda nosso servidor Node/Postgres. Opção desacoplada:

- **App (Docker):** Render / Railway / Fly.io (usam o `Dockerfile` deste repo).
- **Postgres gerenciado:** Neon ou Supabase (use a connection string em `DATABASE_URL`).
- **n8n:** n8n Cloud ou um container na mesma plataforma.
- **DNS:** `quiz.fontanela.com.br` (CNAME) apontando para a plataforma escolhida.
- Configure `VITE_API_URL` no build se a API não ficar na mesma origem do front.

Me chame que eu adapto o passo a passo para a plataforma escolhida.
