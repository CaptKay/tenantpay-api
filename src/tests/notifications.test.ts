// src/tests/notifications.test.ts
import request from "supertest";
import { app } from "../app";
import { getAdminToken } from "./test-utils";

async function createPaidPayment(token: string): Promise<string> {
  // create member
  const memberRes = await request(app)
    .post("/api/members")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Notification Test Member",
      phone: "+31600000002",
    });

  const memberId = memberRes.body.id as string;

  const paymentRes = await request(app)
    .post("/api/payments")
    .set("Authorization", `Bearer ${token}`)
    .send({
      memberId,
      amount: 200,
      currency: "EUR",
      method: "CARD",
    });

  if (paymentRes.status !== 201) {
    throw new Error(`Failed to create payment. Status: ${paymentRes.status}`);
  }

  return paymentRes.body.id as string;
}

describe("Notifications /api/payments/:id/send-receipt", () => {
  it("should accept a WHATSAPP_TEXT receipt send request", async () => {
    const token = await getAdminToken();
    const paymentId = await createPaidPayment(token);

    const res = await request(app)
      .post(`/api/payments/${paymentId}/send-receipt`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        channel: "WHATSAPP_TEXT",
        recipient: "+31600000003",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/Receipt sent via WHATSAPP_TEXT/i);
  });

  it("should validate body and reject invalid channel", async () => {
    const token = await getAdminToken();
    const paymentId = await createPaidPayment(token);

    const res = await request(app)
      .post(`/api/payments/${paymentId}/send-receipt`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        channel: "INVALID_CHANNEL",
        recipient: "+31600000003",
      });

    // Zod + AppError.badRequest should cause 400
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});
