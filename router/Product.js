import routerx from "express-promise-router";
//import routerx from "express";
import ProductController from "../controllers/ProductController";
import auth from '../middlewares/auth';
import multiparty from "connect-multiparty";

var path = multiparty({uploadDir: './uploads/product'});
const router = routerx();

router.post("/register", [auth.verifyAdmin, path], ProductController.register);
router.post("/register_imagen", [auth.verifyAdmin, path], ProductController.register_imagen);
router.post("/remove_imagen", [auth.verifyAdmin, path], ProductController.remove_imagen);

router.put("/update", [auth.verifyAdmin, path], ProductController.update);
router.get("/list", auth.verifyAdmin, ProductController.list);
router.delete("/delete", auth.verifyAdmin, ProductController.remove);

router.get("/uploads/product/:img", ProductController.getImage);
router.get("/show/:id", ProductController.show);

export default router;