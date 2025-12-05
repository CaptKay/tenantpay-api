import express from "express";
import morgan from "morgan";
import cors from "cors";
import { rootRouter } from "./routes";
import { notFoundHandler } from "./core/middleware/notFoundHandler";
import { errorHandler } from "./core/errors/errorHandler";

import swaggerUi from 'swagger-ui-express'
import { openApiSpec } from "./doc/swagger";


const app = express();

//Middleware
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())


app.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'TenantPay backend is running',
        time: new Date().toISOString()
    });
})

//Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec))

//Routes
app.use('/api', rootRouter)

//Middleware
app.use(notFoundHandler)

//Error Handler
app.use(errorHandler)

export { app }
