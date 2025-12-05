
# 🧾 TenantPay API

TenantPay API is a small, production-style Express + TypeScript backend that simulates a **tenant payments and receipts** workflow for associations, housing bodies, and small organisations.

It includes:

- 🔑 JWT-based authentication
- 👥 Members management per organisation
- 💳 Payments with status rules (PAID / PENDING_APPROVAL)
- 🧾 PDF receipt generation and download
- 📲 Multi-channel receipt notifications (WhatsApp text, WhatsApp/Telegram PDF, Email placeholder, SMS placeholder)
- 📖 Public Swagger documentation

---

## 🚀 Tech Stack

- **Runtime:** Node.js (TypeScript)
- **Framework:** Express 5
- **ORM:** Prisma 6 (`@prisma/client` + `prisma`)
- **Database:** SQLite (via `better-sqlite3`) — ideal for demos; can be swapped to Postgres
- **Validation:** Zod 4
- **Auth:** JWT (`jsonwebtoken`, `bcryptjs`)
- **Docs:** Swagger UI (`swagger-ui-express`)
- **Testing:** Jest + Supertest + ts-jest
- **PDFs:** `pdfkit`

---

## 📁 Project Structure

```txt
src/
  app.ts                 # Express app wiring (middleware, routes)
  server.ts              # HTTP server entrypoint

  prisma.ts              # Prisma client

  core/
    config/env.ts        # Env loading (dotenv)
    errors/
      AppError.ts
      errorHandler.ts
    middleware/
      authMiddleware.ts
      validateRequest.ts
      notFoundHandler.ts

  doc/
    swagger.ts           # OpenAPI + Swagger UI setup

  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      auth.repository.ts
      auth.routes.ts
      auth.validation.ts

    members/
      members.controller.ts
      members.service.ts
      members.repository.ts
      members.routes.ts
      members.validation.ts
      members.dtos.ts

    payments/
      payments.controller.ts
      payments.service.ts
      payments.repository.ts
      payments.routes.ts
      payments.validation.ts

    receipts/
      pdf.service.ts
      receipts.service.ts
      receipts.repository.ts

    notifications/
      notifications.service.ts
      notifications.validation.ts

  routes/
    index.ts             # Top-level router mounting all modules

tests/
  auth.test.ts
  members.test.ts
  payments.test.ts
  notifications.test.ts

prisma/
  schema.prisma
````

---

## ⚙️ Getting Started (Local)

### 1️⃣ Clone & install

```bash
git clone https://github.com/<your-username>/tenantpay-api.git
cd tenantpay-api
pnpm install
```

### 2️⃣ Environment variables

Create a `.env` file at the project root:

```env
NODE_ENV=development
PORT=3000

# Auth
JWT_SECRET=super-secret-demo-key

# Prisma (SQLite example)
DATABASE_URL="file:./dev.db"
```

> ⚠️ Never commit `.env` to Git. Use `.gitignore` to protect it.

### 3️⃣ Prisma setup

```bash
pnpm db:generate       # generates Prisma client
pnpm prisma migrate dev --name init   # if you added migrations
```

Or for a quick demo with an existing schema:

```bash
pnpm db:generate
```

### 4️⃣ Run in development

```bash
pnpm dev
```

The API will be available at:

* `http://localhost:3000`
* Swagger Docs: `http://localhost:3000/api-docs`

---

## ✅ Testing & Coverage

Run unit/integration tests:

```bash
pnpm test
```

Run with coverage:

```bash
pnpm test:coverage
```

Coverage configuration is defined in `jest.config.ts` with thresholds, e.g.:

```ts
collectCoverage: true,
coverageDirectory: "coverage",
coverageReporters: ["text", "lcov", "html"],
coverageThreshold: {
  global: {
    statements: 80,
    branches: 70,
    functions: 75,
    lines: 80,
  },
},
```

---

## 🔑 Authentication Flow

1. **Login**

   * `POST /api/auth/login`

   * Request body:

     ```json
     {
       "email": "demo@tenantpay.test",
       "password": "password123"
     }
     ```

   * Returns a JWT token and basic org info.

2. **Use JWT for protected routes**

   * Send `Authorization: Bearer <token>` header to access:

     * `/api/members`
     * `/api/payments`
     * `/api/payments/:id/send-receipt`
     * `/api/payments/:id/receipt`

---

## 👥 Members Module

* `POST /api/members` — create member in current org

  ```json
  {
    "name": "John Tenant",
    "phone": "+31600000000",
    "whatsapp": "+31600000000"
  }
  ```

* `GET /api/members` — list members belonging to the current org
  Response is normalised DTO with `id`, `orgId`, `name`, `phone`, `whatsapp`, `createdAt`.

---

## 💳 Payments Module

* `POST /api/payments` — create a payment for a member

  ```json
  {
    "memberId": "<member-id>",
    "amount": 150,
    "currency": "EUR",
    "method": "CARD"
  }
  ```

* Logic:

  * **Small amounts** (e.g. ≤ 500) → `PAID` and receipt can be sent immediately.
  * **Large amounts** (e.g. > 500) → `PENDING_APPROVAL`.

* `GET /api/payments/:id/receipt` — download receipt PDF for a `PAID` payment.

---

## 🧾 Receipts Module

* Generates a **PDF receipt** per payment and persists receipt metadata.
* Uses `pdfkit` to render a simple, readable layout:

  * Org name
  * Member details
  * Amount, currency, method
  * Payment status and timestamp
  * Payment ID

---

## 📲 Notifications Module

* `POST /api/payments/:id/send-receipt` with body:

  ```json
  {
    "channel": "WHATSAPP_TEXT"
  }
  ```

* Supported channels (validation via Zod):

  * `"EMAIL"`
  * `"WHATSAPP_TEXT"`
  * `"WHATSAPP_PDF"`
  * `"TELEGRAM_PDF"`
  * `"SMS"`

* Current implementation **simulates** sending:

  * Logs WhatsApp text messages to the console.
  * Uses the shared receipt template string for all channels.
  * In a real production integration, this is where you’d plug:

    * Twilio / MessageBird for SMS/WhatsApp
    * Telegram Bot API for PDFs
    * An email service (SendGrid, SES, etc.)

---

## 🌍 Swagger API Docs

Once deployed, you’ll have:

* **Local:** `http://localhost:3000/api-docs`
* **Production (example):** `https://tenantpay-api.onrender.com/api-docs`

Swagger UI includes:

* Auth endpoints
* Members endpoints
* Payments endpoints
* Receipt download endpoints
* Notification send endpoints
* DTO schemas powered by Zod + OpenAPI annotations

---

## 🧪 Testing Philosophy

The test suites cover:

* **Auth**

  * Valid login
  * Invalid credentials error path

* **Members**

  * Creating members for the current org (scoped by JWT)
  * Listing only members for the current org

* **Payments**

  * Creating **PAID** payments for small amounts
  * Creating **PENDING_APPROVAL** payments for large amounts
  * Downloading receipts (200 vs 404 scenarios)

* **Notifications**

  * Sending WhatsApp text receipts for PAID payments
  * Validating invalid channels and body shape

> This gives you a realistic foundation to extend with more edge-cases later.

---

## 🔮 Future Improvements

Planned / nice-to-have upgrades:

1. **Switch DB from SQLite → PostgreSQL**

   * Better for real multi-tenant production workloads.
   * Use managed Postgres (Render, Railway, Supabase, Neon, etc.)

2. **Multi-tenant mode**

   * Proper `orgId` scoping in all queries (already partially there).
   * Organisation onboarding endpoints.
   * Per-organisation API keys.

3. **Real Notification Providers**

   * WhatsApp & SMS via Twilio / MessageBird.
   * Telegram PDF receipts via Bot API.
   * Email via SendGrid/SES with nice HTML templates.

4. **Role-based Access Control**

   * Roles like `FINANCIAL_SECRETARY`, `CHAIRMAN`, `PROVOST`.
   * Fine-grained permissions per route.

5. **Audit Logs & Events**

   * Store every payment change.
   * Webhook notifications to external systems.

6. **Dashboard & Analytics (Frontend)**

   * React / Next / Angular dashboard consuming this API.
   * Charts for collections, arrears, payment methods usage.

7. **Security Hardening**

   * Helmet middleware.
   * Rate limiting.
   * Better password policies.
   * Penetration testing (automated + manual) across API, mobile, and Electron clients.

---

## 📦 Deployment

Example deployment flow:

```bash
# Local build
pnpm build

# Push to GitHub
git add .
git commit -m "chore: initial TenantPay API release"
git push origin main
```

Then:

* Create a **Render Web Service** from the GitHub repo.
* Configure environment variables.
* Deploy and grab the public URL for:

  * API base URL
  * Swagger docs (`/api-docs`)

---

## 🧑‍💻 Author

Built by **[Your Name]** — Full-stack TypeScript developer exploring real-world API design with testing, receipts, and messaging flows.

---

## 📝 License

MIT or proprietary (choose what fits your portfolio).

````

You can tweak author name, license, and the Render URL once you deploy.

---

## 3️⃣ Pushing to GitHub (quick checklist)

From your project folder:

```bash
git init
git remote add origin git@github.com:<your-username>/tenantpay-api.git

git add .
git commit -m "feat: tenantpay api with jwt, payments, receipts and notifications"
git push -u origin main
````

If the repo already exists, just do:

```bash
git add .
git commit -m "chore: prepare for deployment"
git push
```