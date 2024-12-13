import { buildApp } from "./app";
import { envConfig } from "./config";

async function startServer() {
  try {
    const app = await buildApp();

    process.on("uncaughtException", (error) => {
      app.log.error(error, "Uncaught Exception");
      process.exit(1);
    });

    process.on("unhandledRejection", (error) => {
      app.log.error(error, "Unhandled Rejection");
      process.exit(1);
    });

    const signals = ["SIGTERM", "SIGINT"];

    for (const signal of signals) {
      process.on(signal, async () => {
        app.log.info(`Received ${signal}, starting graceful shutdown`);

        try {
          await app.close();
          app.log.info("Server closed successfully");
          process.exit(0);
        } catch (err) {
          app.log.error(err, "Error during shutdown");
          process.exit(1);
        }
      });
    }

    app.listen({ port: envConfig.server.port, host: envConfig.server.host });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
