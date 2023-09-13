import { Router } from "express";
import * as UserController from "@controllers/userController";
import * as authMiddleware from "@middlewares/authMiddleware";
const router: Router = Router();
router.use(authMiddleware.isAuthenticated);
router.get("/profile", UserController.getProfileInfo);
router.patch("/profile", UserController.updateProfileInfo);

export default router;
