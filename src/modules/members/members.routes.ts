import { Router } from "express";
import { MembersController } from "./members.controller";
import { authMiddleware } from "../../core/middleware/authMiddleware";
import { validateBody } from "../../core/middleware/validateRequest";
import { createMemberSchema } from "./members.validation";


const router = Router()
const controller = new MembersController()

router.use(authMiddleware)

router.post('/', validateBody(createMemberSchema), (req, res, next) => controller.create(req as any, res, next))
router.get('/', (req, res, next) => controller.list(req as any, res, next))


export {router as membersRoutes}