import { getConnection } from "../helpers/getConnection";
import { authMiddleware } from "../middlewares/auth";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import e from "express";

const USER_TABLE = "users";
const JWT_SECRET = "segredo-teste";

/**
 * Rotas para /users
 * @param {e.Application} express Server Application
 */
export function usersRoutes(express) {
  express.get("/users", async (_req, res) => {
    const conn = await getConnection();

    try {
      const [rows] = await conn.query(`SELECT * FROM ${USER_TABLE}`);
      res.json(rows);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      await conn.end();
    }
  });



  express.get("/users/:id", async (req, res) => {
    const { id } = req.params;

    const conn = await getConnection();

    try {
      const [rows] = await conn.query(
        `SELECT id, email, username FROM ${USER_TABLE} WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json(rows[0]);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      await conn.end();
    }
  });



  express.put("/users/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "email, username e password são obrigatórios" });
    }

    const conn = await getConnection();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await conn.query(
        `UPDATE ${USER_TABLE} SET email = ?, username = ?, password = ? WHERE id = ?`,
        [email, username, hashedPassword, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({ message: "Usuário atualizado com sucesso" });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      await conn.end();
    }
  });



  express.delete("/users/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    const conn = await getConnection();

    try {
      const [result] = await conn.query("DELETE FROM users WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({ message: "Usuário deletado com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      await conn.end();
    }
  });



  express.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "email, username e password são obrigatórios" });
    }

    const conn = await getConnection();

    try {
      const [existing] = await conn.query(
        `SELECT id FROM ${USER_TABLE} WHERE email = ?`,
        [email]
      );
      if (existing.length > 0) {
        return res.status(409).json({ error: "E-mail já está em uso" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await conn.query(
        `INSERT INTO ${USER_TABLE} (email, username, password) VALUES (?, ?, ?)`,
        [email, username, hashedPassword]
      );

      res
        .status(201)
        .json({
          message: "Usuário registrado com sucesso",
          userId: result.insertId,
        });
    } catch (err) {
      console.error("Erro ao registrar usuário:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      await conn.end();
    }
  });



  express.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const conn = await getConnection();

    try {
      const [rows] = await conn.query(
        `SELECT * FROM ${USER_TABLE} WHERE email = ?`,
        [email]
      );
      if (rows.length === 0) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const user = rows[0];

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = jsonwebtoken.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 3600000, // 1 hora
      });

      res.json({ message: "Login bem-sucedido", token });
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      await conn.end();
    }
  });
}