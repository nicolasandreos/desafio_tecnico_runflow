import { buildApp } from "./build-app.js";

try {
  if (!process.env.API_CLIENT_PORT) {
    throw new Error("API_CLIENT_PORT is not set");
  }
  const port = Number(process.env.API_CLIENT_PORT) || 3000;
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
