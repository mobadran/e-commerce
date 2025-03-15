import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const createRefreshToken = async (userId) => {
  // Sign refresh token
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  // Update refresh token in db
  await User.findByIdAndUpdate(userId, { refreshToken });
  return refreshToken;
};

const createAccessToken = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  return accessToken;
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return reject(err);
      }
      try {
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
          return resolve(false);
        }
        console.log("Decoded.userId:", decoded.userId);
        resolve(decoded.userId);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken };