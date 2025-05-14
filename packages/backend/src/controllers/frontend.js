import { join, resolve } from "path";
import e from "express";

export const frontendPath = resolve(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "frontend",
  "dist"
);

const indexHtml = join(frontendPath, "index.html");

/**
 * Rotas para o front-end
 * @param {e.Application} express Server application
 */
export function frontendRoutes(express) {
  express.get("/dashboard", async (_req, res) => {
    res.sendFile(indexHtml);
  });

  express.get("/login", async (_req, res) => {
    res.sendFile(indexHtml);
  });

  express.get("/register", async (_req, res) => {
    res.sendFile(indexHtml);
  });
}
