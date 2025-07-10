declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

import { getUserBySessionToken } from "../db/UserModel";
import express from "express";
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies["sessionToken"];
    if (!sessionToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = existingUser._id.toString();
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
};
