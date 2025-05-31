import { Router } from "express";
import categoryRoutes from "./categoryRoutes";

const router = Router();

router.use("/categories", categoryRoutes);

export default router;