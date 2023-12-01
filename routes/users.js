import express from "express";
import { signin, signup } from "../controllers/user.js";
import auth from "../middleware/auth.js";
import { viewProfile } from "../controllers/user.js";
import { updateProfile } from "../controllers/user.js";
const router = express.Router();


router.post("/signin", signin);
router.post("/signup", signup);
router.get("/profile", auth, viewProfile);
router.patch("/profile", auth, updateProfile);
export default router;
