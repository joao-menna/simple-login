import { join, resolve } from "path";
import mysql from "mysql2/promise";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

async function getConnection() {
  return await mysql.createConnection({
    multipleStatements: true,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
}

const frontendPath = resolve(
  import.meta.dirname,
  "..",
  "..",
  "frontendvuln",
  "dist",
);
const indexHtml = join(frontendPath, "index.html");

const server = express();

server.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
server.use(express.static(frontendPath));
server.use(express.json());

const USER_TABLE = "users";

server.get("/dashboard", async (_req, res) => {
  res.sendFile(indexHtml);
});

server.get("/login", async (_req, res) => {
  res.sendFile(indexHtml);
});

server.get("/user", async (_req, res) => {
  const conn = await getConnection();

  const [users] = await conn.query(`SELECT * FROM ${USER_TABLE}`);

  await conn.end();

  res.json(users);
});

server.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  const conn = await getConnection();

  const [user] = await conn.query(
    `SELECT id, role, username FROM ${USER_TABLE} WHERE id = ${id} LIMIT 1`,
  );

  await conn.end();

  res.json(user[0]);
});

server.post("/user", async (req, res) => {
  const { role, username, password } = req.body;

  const conn = await getConnection();

  await conn.query(`
    INSERT INTO ${USER_TABLE} (
      role,
      username,
      password
    ) VALUES (
      "${role}",
      "${username}",
      "${password}"
    )
  `);

  const [added_user] = await conn.query(
    `SELECT id, role, username FROM ${USER_TABLE} ORDER BY id DESC LIMIT 1`,
  );

  await conn.end();

  res.status(201).json(added_user[0]);
});

server.put("/user/:id", async (req, res) => {
  const { role, username, password } = req.body;
  const { id } = req.params;

  const conn = await getConnection();

  await conn.query(`
    UPDATE ${USER_TABLE}
    SET
      role = "${role}",
      username = "${username}",
      password = "${password}"
    WHERE id = ${id}
  `);

  await conn.end();

  res.status(204).json();
});

server.delete("/user/:id", async (req, res) => {
  const { id } = req.params;

  const conn = await getConnection();

  await conn.query(`
    DELETE FROM ${USER_TABLE}
    WHERE id = ${id}
  `);

  await conn.end();

  res.status(204).json();
});

server.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const conn = await getConnection();

  const [user] = await conn.query(`
    SELECT id, username
    FROM ${USER_TABLE}
    WHERE username = "${username}" AND password = "${password}"
    LIMIT 1
  `);

  await conn.end();

  if (!user.length) {
    res.json({ redirect: "/login?wrong-text=usuário ou senha inválidos" });
    return;
  }

  res.cookie("USERLOGGED", user[0].id);
  res.json({ message: "Logged in successfully"});
});

server.listen(8080, "0.0.0.0", () => {
  console.log("Started vulnerable server in :8080")
});
