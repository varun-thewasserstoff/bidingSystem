import express from "express"
import controllers from "../controllers";
import { authenticateUser } from "../middleware";

const router=express.Router()

router.get("/allauctions",authenticateUser,controllers.userController.allAuctions)
router.get("/winner",authenticateUser,controllers.userController.UserWinningAuction)
router.patch("/placebiding/:auctionId",authenticateUser,controllers.userController.placeBid)
router.get("/checkresult/:auctionId",authenticateUser,controllers.userController.checkResult)
export default router