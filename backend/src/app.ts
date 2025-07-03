import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./shared/middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

export default app;
