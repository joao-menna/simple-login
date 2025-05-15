import csurf from "csurf";

export const csrfProtection = csurf({
  cookie: {
    httpOnly: false,
    secure: false,
    sameSite: "strict",
  },
  ignoreMethods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"]
});
