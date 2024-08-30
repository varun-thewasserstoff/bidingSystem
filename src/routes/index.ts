import express from "express";
import authRoute from "./auth"
import adminRoute from "./admin"
import userRoute from "./user"
import path from "path";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path:"/admin",
    route:adminRoute
  },
  {
    path:"/user",
    route:userRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.get("/", async (req, res) => {
  return res.send("Server is running");
});


export default router;