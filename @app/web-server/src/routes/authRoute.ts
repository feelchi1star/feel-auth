import { Router } from "express";
import { logIn, signUp } from "@controllers/authController";
const router: Router = Router();

router.post("/signup", signUp);
router.post("/login", logIn);

export default router;
