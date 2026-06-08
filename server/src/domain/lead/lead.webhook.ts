/**
 * Disparo do lead para o orquestrador de marketing (n8n).
 *
 * É chamado SOMENTE após a persistência bem-sucedida do lead. Como o insert
 * falha em e-mail duplicado, o disparo ocorre apenas para leads novos — o que
 * garante a idempotência da cadência (o lead não entra duas vezes na sequência).
 *
 * Falhas aqui são não-fatais: o lead já está salvo no banco (fonte da verdade),
 * então apenas registramos o erro para reprocessamento/observabilidade.
 */
export interface OrchestratorLeadPayload {
  id: string;
  name: string;
  email: string;
  score: number;
  profile: string;
  answers: unknown;
}

export const dispatchLeadToOrchestrator = async (
  lead: OrchestratorLeadPayload
): Promise<void> => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[Lead] N8N_WEBHOOK_URL não configurada — disparo para o orquestrador ignorado."
    );
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        score: lead.score,
        profile: lead.profile,
        answers: lead.answers,
      }),
    });

    console.log(
      `[Lead] Lead ${lead.id} (perfil ${lead.profile}) enviado ao orquestrador.`
    );
  } catch (error: unknown) {
    console.error(
      "[Lead] Falha ao notificar o orquestrador (lead já persistido):",
      error instanceof Error ? error.message : "Erro desconhecido"
    );
  }
};
