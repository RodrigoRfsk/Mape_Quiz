# Integração n8n — Cadência por Perfil (MAPE)

Orquestração que recebe o lead do backend e dispara a comunicação certa para
cada **perfil de audiência (A/B/C)** do Manifesto MAPE.

```
Backend (POST N8N_WEBHOOK_URL)
        │  { id, name, email, score, profile, answers }
        ▼
Webhook → Normalizar Lead → Roteia por Perfil (A/B/C)
                          │          ├─ A → E-mail 01 → (2d) → E-mail 02 → (3d) → E-mail 03
                          │          ├─ B → E-mail 01 → (2d) → E-mail 02 → (3d) → E-mail 03
                          │          └─ C → E-mail 01 → (2d) → E-mail 02 → (3d) → E-mail 03
                          └─ Notificar SDR (abertura da cadência de WhatsApp)
```

- **E-mails**: drip automático, copy calibrada por perfil (`MAPE_Emails_por_Perfil.docx`), embutida no workflow.
- **WhatsApp/SDR**: cadência conduzida por pessoa. O nó *Notificar SDR* avisa a equipe a cada lead com o perfil já calculado; os scripts estão em [`whatsapp-sdr-scripts.md`](./whatsapp-sdr-scripts.md).

## Arquivos

| Arquivo | O quê |
|---|---|
| `mape-cadence.workflow.json` | Workflow importável no n8n |
| `whatsapp-sdr-scripts.md` | Scripts de WhatsApp/SDR (6 mensagens × 3 perfis) |

## Stack local (docker-compose)

O `docker-compose.yml` do projeto já sobe **n8n** (`:5678`) e **Mailhog**
(SMTP de teste em `:1025`, UI em `:8025`) junto do Postgres:

```bash
docker compose up -d
# n8n:     http://localhost:5678
# Mailhog: http://localhost:8025
```

Como o n8n roda no Docker, ele alcança o backend (no host) por
`http://host.docker.internal:3001` e o Mailhog pelo nome do serviço `mailhog`.

## Como importar e configurar

1. **Importar**: no n8n → *Workflows* → *Import from File* → selecione `mape-cadence.workflow.json`.
2. **Credencial de e-mail (SMTP)**: abra qualquer nó `E-mail` e associe uma credencial SMTP. Para o Mailhog do compose use `host: mailhog`, `port: 1025`, sem SSL/credenciais. Ajuste o remetente: troque `contato@SEU_DOMINIO.com` (em todos os nós de e-mail e no *Notificar SDR*).
3. **Destino do SDR**: no nó *Notificar SDR*, troque `sdr@SEU_DOMINIO.com` pelo e-mail/integração da equipe (pode trocar por Slack/CRM, ver abaixo).
4. **Ativar** o workflow. Copie a *Production URL* do nó *Webhook*.
5. **Conectar o backend**: defina essa URL como `N8N_WEBHOOK_URL` no `server/.env` do projeto. O backend dispara o lead automaticamente após persistir (ver `server/src/domain/lead/lead.webhook.ts`).

## Payload esperado

O backend envia (de `dispatchLeadToOrchestrator`):

```json
{
  "id": "uuid-do-lead",
  "name": "Maria Silva",
  "email": "maria@example.com",
  "score": 61,
  "profile": "B",
  "answers": { "...": "respostas completas do quiz" }
}
```

O nó *Normalizar Lead* lê de `$json.body` e expõe `email`, `name`, `firstName`
e `profile` (em maiúsculo) para os nós seguintes.

## Ajustes comuns

- **Intervalos do drip**: nós `Espera 2d` / `Espera 3d` (campo *amount/unit*).
- **Perfil não reconhecido**: a saída *fallback* do Switch fica sem conexão (lead não entra em drip, mas o SDR ainda é notificado).
- **CTA**: todos os e-mails convergem para *responder ENCONTRO*. Para automatizar a resposta inbound (detectar "ENCONTRO" e enviar o link), crie um fluxo separado no provedor de e-mail/WhatsApp.

## Extensões opcionais

- **WhatsApp automatizado**: troque o nó *Notificar SDR* (ou adicione em paralelo) por um nó HTTP Request do seu provedor (Meta Cloud API, Twilio, Z-API…) usando a MSG 01 de `whatsapp-sdr-scripts.md` por perfil.
- **Notificar via Slack/CRM**: substitua o nó *Notificar SDR* por um nó Slack/HubSpot etc., mantendo as mesmas expressões de lead.

> Observação: o workflow foi escrito para n8n com nós core (`webhook`, `set`,
> `switch`, `wait`, `emailSend`). Dependendo da versão do seu n8n, ao importar
> pode ser sugerido atualizar a versão de algum nó — basta aceitar.
