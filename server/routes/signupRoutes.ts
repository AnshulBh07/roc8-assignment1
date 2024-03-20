import express from "express";
import { addUser, verifyUser } from "../controllers/signupControllers";
const router = express.Router();

router.post("/", addUser);

router.post("/verify", verifyUser);

export default router;
