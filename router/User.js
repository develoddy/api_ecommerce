 import routerx from "express-promise-router";
//import routerx from "express";
import userController from "../controllers/UserController";
import auth from '../middlewares/auth';

//const router = routerx();
const router = routerx();

// http://localhost:/3000/api/user/register
router.post("/register", userController.register);
router.put("/update", userController.update);
router.get("/list", auth.verifyAdmin, userController.list);
router.post("/login", userController.login);
router.delete("/delete", userController.remove);

export default router;