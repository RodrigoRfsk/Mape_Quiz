import { describe, it, expect, vi, beforeEach } from "vitest";

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
  email: "maria@example.com",
  phone: "(11) 99999-9999",
  moment: "started",
  clarity: "partial",
  clients: "pontual",
  timeline: "3m",
  "main-question": "Como estruturar minha entrada?",
};

describe("processLeadSubmission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("recomputes score and profile on the server, ignoring client-sent values", async () => {
    createLeadMock.mockResolvedValue({ id: "lead-1", email: validPayload.email });

    await processLeadSubmission({ ...validPayload, profile: "A", score: 999 });

    expect(createLeadMock).toHaveBeenCalledTimes(1);
    const persisted = createLeadMock.mock.calls[0][0];
    expect(persisted.profile).toBe("B");
    expect(persisted.score).not.toBe(999);
    expect(typeof persisted.score).toBe("number");
  });

  it("dispatches to the orchestrator only after persisting, with the new lead data", async () => {
    createLeadMock.mockResolvedValue({ id: "lead-1", email: validPayload.email });

    await processLeadSubmission(validPayload);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    const dispatched = dispatchMock.mock.calls[0][0];
    expect(dispatched.id).toBe("lead-1");
    expect(dispatched.profile).toBe("B");
  });

  it("does not dispatch the cadence when the email already exists (idempotency)", async () => {
    createLeadMock.mockRejectedValue({ code: "23505" });

    await expect(processLeadSubmission(validPayload)).rejects.toBeInstanceOf(
      EmailAlreadyExistsError
    );
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid payload without touching the database", async () => {
    await expect(
      processLeadSubmission({ name: "x" })
    ).rejects.toBeInstanceOf(ValidationError);
    expect(createLeadMock).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
