import routerx from "express-promise-router";
import sliderController from "../controllers/SliderController";
import auth from '../middlewares/auth';
import multiparty from "connect-multiparty";

var path = multiparty({uploadDir: './uploads/slider'});
const router = routerx();

router.post("/register", [auth.verifyAdmin, path], sliderController.register);
router.put("/update", [auth.verifyAdmin, path], sliderController.update);
router.get("/list", auth.verifyAdmin, sliderController.list);
router.delete("/delete", auth.verifyAdmin, sliderController.remove);

router.get("/uploads/slider/:img", sliderController.getImage);

export default router;