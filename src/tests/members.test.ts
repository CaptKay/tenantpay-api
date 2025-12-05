// src/tests/members.test.ts
import request from "supertest";
import { app } from "../app";
import { getAdminToken } from "./test-utils";

describe("Members /api/members", () => {
  it("should reject access without a token", async () => {
    const res = await request(app).get("/api/members");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should create a member for the current org", async () => {
    const token = await getAdminToken();

    const res = await request(app)
      .post("/api/members")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Member",
        phone: "+31600000000",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("orgId");
    expect(res.body.name).toBe("Test Member");
  });

  it("should list members for the current org", async () => {
    const token = await getAdminToken();

    const res = await request(app)
      .get("/api/members")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("orgId");
      expect(res.body[0]).toHaveProperty("name");
    }
  });
});
