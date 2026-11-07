import { buildApp } from "./build-app.js";

try {

  const port = Number(process.env.APP_PORT) || 3000;
  const app = buildApp();
  await app.listen({
    port,
    host: "0.0.0.0",
  });

  console.log(`Server running on port ${port}`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
