import jsonwebtoken from "jsonwebtoken";
import e from "express";

const JWT_SECRET = "segredo-teste";

/**
 * Middleware que faz a autenticação do usuário
 * @param {e.Request} req Request
 * @param {e.Response} res Response
 * @param {e.NextFunction} next Next function
 */
export function authMiddleware(req, res, next) {
  const token = req.cookies.token ?? req.headers["Authorization"];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  try {
    const decoded = jsonwebtoken.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  next();
};
