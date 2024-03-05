import { Request, Response, NextFunction } from "express";

export const token = async (req: Request, res: Response) => {
  const { token } = req.cookies;
  if (!token) return res.status(401);
  try {
    return res.status(200).json({
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};
