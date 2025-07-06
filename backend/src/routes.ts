import { Router } from "express";
import categoryRoutes from "./modules/categories/categories.router";
import authRoutes from "./modules/auth/auth.router";
import publisherRoutes from "./modules/publisher/publisher.routes";
import adminRoutes from "./modules/admin/admin.routes";
import newsRoutes from "./modules/news/news.routes";
import statsRoutes from "./modules/stats/stats.routes";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

router.use("/categories", categoryRoutes);
router.use("/publisher", publisherRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/news", newsRoutes);
router.use("/stats", statsRoutes);

export default router;
