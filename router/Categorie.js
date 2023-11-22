import routerx from "express-promise-router";
//import routerx from "express";
import categorieController from "../controllers/CategorieController";
import auth from '../middlewares/auth';
import multiparty from "connect-multiparty";

var path = multiparty({uploadDir: './uploads/categorie'});
const router = routerx();

router.post("/register", [auth.verifyAdmin, path], categorieController.register);
router.put("/update", [auth.verifyAdmin, path], categorieController.update);
router.get("/list", auth.verifyAdmin, categorieController.list);
router.delete("/delete", auth.verifyAdmin, categorieController.remove);

export default router;