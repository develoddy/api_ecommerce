import routerx from "express-promise-router";
//import routerx from "express";
import productController from "../controllers/ProductController";
import variedadController from '../controllers/VariedadController';
import auth from '../middlewares/auth';
import multiparty from "connect-multiparty";

var path = multiparty({uploadDir: './uploads/product'});
const router = routerx();

router.post("/register", [auth.verifyAdmin, path], productController.register);
router.post("/register_imagen", [auth.verifyAdmin, path], productController.register_imagen);
router.post("/remove_imagen", [auth.verifyAdmin, path], productController.remove_imagen);

router.put("/update", [auth.verifyAdmin, path], productController.update);
router.get("/list", auth.verifyAdmin, productController.list);
router.delete("/delete", auth.verifyAdmin, productController.remove);

router.get("/uploads/product/:img", productController.getImage);
router.get("/show/:id", productController.show);

// Variedad
router.post("/register-variedad", [auth.verifyAdmin, path], variedadController.register);
router.put("/update-variedad", [auth.verifyAdmin, path], variedadController.update);
router.delete("/delete-variedad/:id", auth.verifyAdmin, variedadController.delete);

// Printfull
//router.get("/printful-list",productController.storeListProducts);
// Simulador de webhook
//router.post("/webhook/printful", productController.webhook);


export default router;