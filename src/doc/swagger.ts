// src/docs/swagger.ts
export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "TenantPay API",
    version: "1.0.0",
    description:
      "Multi-tenant payments + receipts API (Org/User/Member/Payment/Receipt)",
  },
  servers: [
    {
      url: "http://localhost:4000",
    },
  ],
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and get JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
          },
          "401": {
            description: "Invalid credentials",
          },
        },
      },
    },
    "/api/members": {
      get: {
        tags: ["Members"],
        summary: "List members for current org",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of members",
          },
        },
      },
      post: {
        tags: ["Members"],
        summary: "Create member in current org",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  phone: { type: "string" },
                  whatsapp: { type: "string" },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Member created",
          },
        },
      },
    },
    "/api/payments": {
      post: {
        tags: ["Payments"],
        summary: "Create payment",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  memberId: { type: "string" },
                  amount: { type: "number" },
                  currency: { type: "string" },
                  method: {
                    type: "string",
                    enum: ["CASH", "CARD", "TRANSFER"],
                  },
                },
                required: ["memberId", "amount", "currency", "method"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Payment created",
          },
        },
      },
    },
    "/api/payments/{id}": {
      get: {
        tags: ["Payments"],
        summary: "Get payment by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Payment details" },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/payments/{id}/receipt": {
      get: {
        tags: ["Payments"],
        summary: "Download payment receipt PDF",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "PDF receipt stream" },
          "404": { description: "Receipt not found" },
        },
      },
    },
    "/api/payments/{id}/send-receipt": {
      post: {
        tags: ["Notifications"],
        summary: "Send receipt via email/WhatsApp/Telegram/SMS",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  channel: {
                    type: "string",
                    enum: [
                      "EMAIL",
                      "WHATSAPP_TEXT",
                      "WHATSAPP_PDF",
                      "TELEGRAM_PDF",
                      "SMS",
                    ],
                  },
                  recipient: { type: "string" },
                },
                required: ["channel", "recipient"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Receipt sent" },
          "400": { description: "Error sending receipt" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
