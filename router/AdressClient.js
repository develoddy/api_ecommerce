import routerx from "express-promise-router";
import adressClienteController from "../controllers/AdressClienteController";
import auth from '../middlewares/auth';

const router = routerx();

router.post("/register", auth.verifyEcommerce, adressClienteController.register);
router.put("/update", auth.verifyEcommerce, adressClienteController.update);
router.get("/list", auth.verifyEcommerce, adressClienteController.list);
router.delete("/delete/:id", auth.verifyEcommerce, adressClienteController.delete);

export default router;