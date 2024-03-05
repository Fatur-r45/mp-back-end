import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

// Register
export const register = async (req: Request, res: Response) => {
  const { nama, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!users) {
    const result = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role: "user",
      },
    });
    return res.status(200).json({
      message: "user created",
    });
  } else {
    return res.json({
      message: "user sudah terdaptar",
    });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(404).json({
      messgae: "User not found",
    });
  }
  if (!user?.password) {
    return res.status(404).json({
      message: "Password not set",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (isPasswordValid) {
    const payload = {
      id: user.id,
      name: user.nama,
      email: user.email,
      role: user.role,
    };
    const secretKey = process.env.JWT_SECRET!;
    const expireIn = 60 * 60 * 24;
    const token = jwt.sign(payload, secretKey, { expiresIn: expireIn });
    try {
      res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        message: "login success",
        token: token,
      });
    } catch (error) {
      return res.status(400).json({
        message: error,
      });
    }
  } else {
    return res.status(403).json({
      message: "Wrong Password",
    });
  }
};

// get User
export const getUsers = async (req: Request, res: Response) => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
    },
  });
  res.status(200).json({
    data: result,
    message: "User List",
  });
};
export const getUserById = async (req: Request, res: Response) => {
  const result = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      jawaban_peserta: true,
    },
  });
  res.status(200).json({
    data: result,
    message: "User List",
  });
};

export const Logout = async (req: Request, res: Response) => {
  const tokenCookies = req.cookies.token;
  if (!tokenCookies) return res.sendStatus(204);
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

// update user
export const patchUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const result = await prisma.user.update({
    data: {
      nama: name,
      email: email,
    },
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
    },
  });
  res.status(200).json({
    data: result,
    message: `user ${id}  updated`,
  });
};
