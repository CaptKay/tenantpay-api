import request from "supertest";
import {app} from "../app";

const ADMIN_EMAIL = "admin@demo.org";
const ADMIN_PASSWORD = "Admin123!";

describe("Auth /api/auth/login", ()=>{
    it("should login with valid credentials and return a JWT", async ()=>{
        const res = await request(app).post("/api/auth/login").send({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        })
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toBe("string");
    })

      it("should fail with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: ADMIN_EMAIL,
        password: "WrongPassword123!",
      });

    expect(res.status).toBe(401); 
    expect(res.body).toHaveProperty("message");
  });
})