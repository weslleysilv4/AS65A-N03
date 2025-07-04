import { Router } from "express";
import {
  getNewsStatsHandler,
  getCategoryStatsHandler,
} from "./stats.controller";

const router = Router();

router.get("/news", getNewsStatsHandler);
router.get("/categories", getCategoryStatsHandler);

export default router;
