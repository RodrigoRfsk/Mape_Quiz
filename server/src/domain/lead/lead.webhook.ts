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
      "[Lead] N8N_WEBHOOK_URL is not set — skipping orchestrator dispatch."
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
      `[Lead] Lead ${lead.id} (profile ${lead.profile}) dispatched to orchestrator.`
    );
  } catch (error: unknown) {
    console.error(
      "[Lead] Failed to notify orchestrator (lead already persisted):",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
