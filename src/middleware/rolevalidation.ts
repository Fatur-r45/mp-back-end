import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

interface UserData {
  id: String;
  name: String;
  role: String;
}

interface ValidationRequest extends Request {
  userData: UserData;
}

export const roleValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationRequest = req as ValidationRequest;
  const { authorization } = validationRequest.headers;
  if (!authorization) {
    return res.status(401).json({
      message: "token di perlukan",
    });
  }
  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_SECRET!;
  try {
    const jwtData: UserData = jwt.decode(token) as UserData;
    const jwtDecode = jwt.verify(token, secret);
    if (jwtData.role !== "admin") return res.status(403);
    if (typeof jwtDecode !== "string") {
      validationRequest.userData = jwtDecode as UserData;
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  next();
};
