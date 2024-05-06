console.log("router...");
import routerx from "express-promise-router";

import ProductPrintful from "./ProductPrintful";

const router = routerx();
router.use("/products", ProductPrintful);

export default router;