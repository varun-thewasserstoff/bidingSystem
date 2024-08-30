import express from "express"
import controllers from "../controllers";
import { autctionuser } from "../models/schema";
import { authenticateUser } from "../middleware";
const router=express.Router()

router.post("/",controllers.authController.register)
router.post("/login",controllers.authController.logIn)
router.get("/check",authenticateUser,controllers.authController.check)


export default router