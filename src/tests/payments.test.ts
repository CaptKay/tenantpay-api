// src/tests/payments.test.ts
import request from "supertest";
import { app } from "../app";
import { getAdminToken } from "./test-utils";

async function createMemberAndReturnId(token: string): Promise<string> {
  const res = await request(app)
    .post("/api/members")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Payment Test Member",
      phone: "+31600000001",
    });

  if (res.status !== 201) {
    throw new Error(`Failed to create member. Status: ${res.status}`);
  }

  return res.body.id as string;
}

describe("Payments /api/payments", () => {
  it("should create a PAID payment for small amounts and allow receipt download", async () => {
    const token = await getAdminToken();
    const memberId = await createMemberAndReturnId(token);

    // 1. Create a small payment (<= 1000)
    const paymentRes = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        memberId,
        amount: 100,
        currency: "EUR",
        method: "CASH",
      });

    expect(paymentRes.status).toBe(201);
    expect(paymentRes.body).toHaveProperty("id");
    expect(paymentRes.body.status).toBe("PAID");

    const paymentId = paymentRes.body.id as string;

    // 2. Try downloading the receipt PDF
    const receiptRes = await request(app)
      .get(`/api/payments/${paymentId}/receipt`)
      .set("Authorization", `Bearer ${token}`);

    expect(receiptRes.status).toBe(200);
    // Optionally check headers:
    expect(receiptRes.headers["content-type"]).toMatch(/application\/pdf/);
  });

  it("should create a PENDING_APPROVAL payment for large amounts", async () => {
    const token = await getAdminToken();
    const memberId = await createMemberAndReturnId(token);

    const paymentRes = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        memberId,
        amount: 5000,
        currency: "EUR",
        method: "TRANSFER",
      });

    expect(paymentRes.status).toBe(201);
    expect(paymentRes.body.status).toBe("PENDING_APPROVAL");

    const paymentId = paymentRes.body.id as string;

    // Receipt is not supposed to exist yet (under our rule)
    const receiptRes = await request(app)
      .get(`/api/payments/${paymentId}/receipt`)
      .set("Authorization", `Bearer ${token}`);

    // You currently throw 404 in the controller when no receipt
    expect([404, 400]).toContain(receiptRes.status);
  });
});
