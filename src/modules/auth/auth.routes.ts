import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateBody } from "../../core/middleware/validateRequest";
import { loginSchema } from "./auth.validation";

const router = Router();
const controller = new AuthController();


router.post("/login", validateBody(loginSchema), (req,res, next)=> controller.login(req,res,next))



 



//test route
router.get("/test", (req,res)=>{
    res.json({
        message: "Auth module is wired correctly"
    })
})

export {router as authRoutes}