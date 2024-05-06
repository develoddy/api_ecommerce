console.log("router productPrintful...");

import routerx from "express-promise-router";
//import routerx from "express";
import productController from "../../controllers/printful/ProductPrintfulController";
//import variedadController from '../controllers/VariedadController';
//import auth from '../../middlewares/auth';
//import multiparty from "connect-multiparty";

//var path = multiparty({uploadDir: './uploads/product'});
const router = routerx();


router.get("/list",productController.list);
router.get("/store-list",productController.storeListProducts);

export default router;