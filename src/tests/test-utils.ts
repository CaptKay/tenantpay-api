// src/tests/test-utils.ts
import request from "supertest";
import { app } from "../app";

const ADMIN_EMAIL = "admin@demo.org";
const ADMIN_PASSWORD = "Admin123!";

export async function getAdminToken(): Promise<string> {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

  if (res.status !== 200 || !res.body.token) {
    throw new Error("Could not get admin token. Check seeded user credentials.");
  }

  return res.body.token as string;
}
