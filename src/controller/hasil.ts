import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const postHasilJawaban = async (req: Request, res: Response) => {
  const { id_user, id_quiz } = req.body;
  const jawaban = await prisma.jawaban_peserta.findMany({
    where: {
      id_quiz: Number(id_quiz),
    },
  });
  const jumlahPoint = jawaban
    .map((item) => {
      return item.skor;
    })
    .reduce((a, c) => {
      let nilai1 = a ? a : 0;
      let nilai2 = c ? c : 0;
      return nilai1 + nilai2;
    });
  const data = await prisma.hasil_jawaban.create({
    data: {
      id_user: Number(id_user),
      id_quiz: Number(id_quiz),
      hasil: Number(jumlahPoint! * 10),
    },
  });
  return res.status(200).json({
    message: "data berhasil di tambahkan",
    data,
  });
};

export const getAllHasilJawaban = async (req: Request, res: Response) => {
  const data = await prisma.hasil_jawaban.findMany();

  try {
    return res.status(200).json({
      message: "data berhasil di ambil",
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getHasilJawabanByUserId = async (req: Request, res: Response) => {
  const data = await prisma.hasil_jawaban.findMany({
    where: {
      id_user: Number(req.params.id),
    },
  });

  try {
    return res.status(200).json({
      message: "data berhasil di ambil",
      data,
    });
  } catch (error) {
    console.log(error);
  }
};
