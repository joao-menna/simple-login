import { frontendPath, frontendRoutes } from "./controllers/frontend.js";
import { usersRoutes } from "./controllers/users.js";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import csurf from "csurf";
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

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
});

server.use(csrfProtection);

server.get("/csrf-token", async (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

frontendRoutes(server)
usersRoutes(server)

server.listen(8081, "0.0.0.0", () => {
  console.log("Started reinforced server in :8081");
});
