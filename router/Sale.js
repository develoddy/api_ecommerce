import routerx from "express-promise-router";
import saleController from "../controllers/SaleController";
import auth from '../middlewares/auth';

const router = routerx();

router.post("/register", auth.verifyEcommerce, saleController.register);
//router.get("/send_email/:id", saleController.send_email);



export default router;