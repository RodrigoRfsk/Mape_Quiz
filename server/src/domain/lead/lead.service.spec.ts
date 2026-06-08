import { describe, it, expect, vi, beforeEach } from "vitest";

// Mockamos as fronteiras de I/O para testar a regra de negócio isoladamente.
// Mockar o repository também evita que @server/db (pool do Postgres) seja
// carregado durante o teste.
vi.mock("./lead.repository", () => ({
  createLeadInDb: vi.fn(),
}));
vi.mock("./lead.webhook", () => ({
  dispatchLeadToOrchestrator: vi.fn(),
}));

import {
  processLeadSubmission,
  ValidationError,
  EmailAlreadyExistsError,
} from "./lead.service";
import { createLeadInDb } from "./lead.repository";
import { dispatchLeadToOrchestrator } from "./lead.webhook";

const createLeadMock = vi.mocked(createLeadInDb);
const dispatchMock = vi.mocked(dispatchLeadToOrchestrator);

const validPayload = {
  name: "Maria Silva",
  area: "Finanças corporativas",
  experience: "more-20",
  moment: "started",
  "main-question": "Como estruturar minha entrada?",
  email: "maria@example.com",
  phone: "(11) 99999-9999",
  clarity: "partial",
  sector: "Indústria de médio porte",
  clients: "pontual",
  "expected-result": "structure",
  timeline: "3m",
};

describe("processLeadSubmission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("recalcula score e perfil no servidor, ignorando os valores do cliente", async () => {
    createLeadMock.mockResolvedValue({ id: "lead-1", email: validPayload.email });

    // O cliente tenta forjar profile "A" e um score absurdo.
    await processLeadSubmission({ ...validPayload, profile: "A", score: 999 });

    expect(createLeadMock).toHaveBeenCalledTimes(1);
    const persisted = createLeadMock.mock.calls[0][0];
    // moment === "started" => Perfil B (não o "A" enviado pelo cliente).
    expect(persisted.profile).toBe("B");
    expect(persisted.score).not.toBe(999);
    expect(typeof persisted.score).toBe("number");
  });

  it("dispara para o orquestrador apenas após persistir, com os dados do lead novo", async () => {
    createLeadMock.mockResolvedValue({ id: "lead-1", email: validPayload.email });

    await processLeadSubmission(validPayload);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    const dispatched = dispatchMock.mock.calls[0][0];
    expect(dispatched.id).toBe("lead-1");
    expect(dispatched.profile).toBe("B");
  });

  it("não dispara a cadência quando o e-mail já existe (idempotência)", async () => {
    createLeadMock.mockRejectedValue({ code: "23505" });

    await expect(processLeadSubmission(validPayload)).rejects.toBeInstanceOf(
      EmailAlreadyExistsError
    );
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it("rejeita payload inválido sem tocar no banco", async () => {
    await expect(
      processLeadSubmission({ name: "x" })
    ).rejects.toBeInstanceOf(ValidationError);
    expect(createLeadMock).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
