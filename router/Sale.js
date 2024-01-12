import routerx from "express-promise-router";
import saleController from "../controllers/SaleController";
import auth from '../middlewares/auth';

const router = routerx();

router.post("/register", auth.verifyEcommerce, saleController.register);

export default router;