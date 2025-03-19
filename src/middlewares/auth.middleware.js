import { verifyAccessToken } from "../utils/tokens.js";

const validateAuthorization = (req, res) => {
  let authorization = req.headers.authorization;
  if (!authorization) return res.status(400).json({ message: "Access Token is required" });
  authorization = authorization.split(" ");
  if (authorization.length !== 2 || authorization[0] !== "Bearer" || !authorization[1]) return res.status(400).json({ message: "Invalid Authorization header format" });

  let decoded;
  try {
    decoded = verifyAccessToken(authorization[1]);
  } catch (TokenExpiredError) {
    return res.status(401).json({ error: "Access token expired" });
  }
  if (!decoded) return res.status(403).json({ error: "Access Token Invalid" });
  return decoded;
};

// Authenticated User Middleware
export const authenticatedUser = (req, res, next) => {
  try {
    const decoded = validateAuthorization(req, res);
    if (res.headersSent) return;
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

// Authenticated Admin Middleware
export const authenticatedAdmin = (req, res, next) => {
  try {
    const decoded = validateAuthorization(req, res);
    if (res.headersSent) return;
    if (decoded.role !== "admin") return res.status(403).json({ error: "You are not an admin" });
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};