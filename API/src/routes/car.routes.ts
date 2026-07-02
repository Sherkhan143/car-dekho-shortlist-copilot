import { Router } from "express";
import { getCars, recommend } from "../controllers/car.controller";

const router = Router();

router.get("/all", getCars);
router.post("/recommend", recommend);

export default router;
