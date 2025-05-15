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
server.use(cookieParser("secret"));
server.use(express.static(frontendPath));
server.use(express.json());

frontendRoutes(server)

server.use(csrfProtection)

server.get("/csrf-token", async (req, res) => {
  const token = req.csrfToken()
  res.cookie("_csrf", token, {
    httpOnly: false,
    secure: false,
    sameSite: "strict",
  })
  res.send({ token })
});

usersRoutes(server)

server.listen(8081, "0.0.0.0", () => {
  console.log("Started reinforced server in :8081");
});
