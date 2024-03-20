import express from "express";
import {
  addCategory,
  removeCategory,
} from "../controllers/categoryControllers";
const router = express.Router();

router.post("/add", addCategory);

router.post("/remove", removeCategory);

export default router;
