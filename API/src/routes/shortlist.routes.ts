import { Router } from "express";
import {
  addToShortlist,
  getShortlist,
  removeFromShortlist,
} from "../controllers/shortlist.controller";

const router = Router();

router.post("/add", addToShortlist);
router.get("/:sessionId", getShortlist);
router.delete("/remove", removeFromShortlist);

export default router;
