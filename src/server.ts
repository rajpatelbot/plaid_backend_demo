import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import apiRoutes from "./routes/api.route";
import { closeDB, initDB } from "./db";

const createApp = (): Express => {
  const app = express();

  // await initDB();

  // Security middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  app.use("/api", apiRoutes);

  return app;
};

const startServer = async (app: Express) => {
  if (!env.validate()) {
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};

// Handle termination
const setupGracefulShutdown = () => {
  process.on("uncaughtException", async (error) => {
    console.error("Uncaught Exception:", error);
    await closeDB();
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
  });
};

// Create the app instance
const app = createApp();
setupGracefulShutdown();

// Start server if this file is run directly
if (require.main === module) {
  startServer(app);
}

// Export for testing
export { app, startServer };
