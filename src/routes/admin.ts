import express from "express"
import controllers from "../controllers";
import { autctionuser } from "../models/schema";
import { authenticateUser } from "../middleware";

const router=express.Router()

router.post("/createauction",authenticateUser,controllers.adminController.createAuction)
router.get("/getauction",authenticateUser,controllers.adminController.getAllAuctions)
router.get("/getallUsers",authenticateUser,controllers.adminController.getUsers)
router.patch("/updateauction/:auctionId",authenticateUser,controllers.adminController.updateAuction)
router.patch("/deleteauction/:auctionId",authenticateUser,controllers.adminController.deleteAuction)


export default router