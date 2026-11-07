import { buildApp } from "./build-app.js";

try {
  if (!process.env.CLIENT_API_BASE_URL) {
    throw new Error("CLIENT_API_BASE_URL is not set");
  }

  const url = new URL(process.env.CLIENT_API_BASE_URL);
  const port = Number(url.port);
  const prefix = url.pathname.replace(/\/$/, "") || "/";
  const app = buildApp(prefix);
  await app.listen({
    port,
    host: "0.0.0.0",
  });

  console.log(`Server running on port ${port}`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
