import { frontendPath, frontendRoutes } from "./controllers/frontend.js";
import { csrfProtection } from "./middlewares/csrf.js";
import { usersRoutes } from "./controllers/users.js";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const server = express();

server.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
server.use(cookieParser());
server.use(express.static(frontendPath));
server.use(express.json());

server.get("/csrf-token", csrfProtection, async (req, res) => {
  res.cookie("CSRF-TOKEN", req.csrfToken());
  res.send("CSRF-TOKEN in cookie.")
});

frontendRoutes(server)
usersRoutes(server)

server.listen(8081, "0.0.0.0", () => {
  console.log("Started reinforced server in :8081");
});
