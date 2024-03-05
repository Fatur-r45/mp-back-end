import { PrismaClient } from "@prisma/client";
import { Request, Response, query } from "express";

const prisma = new PrismaClient();

export const postJawaban = async (req: Request, res: Response) => {
  const { id_user, id_quiz, id_pertanyaan, jawaban_peserta } = req.body;
  if (!id_user || !id_quiz || !id_pertanyaan || !jawaban_peserta)
    return res.status(400).json({
      message: "semua field harus terisi",
    });

  const dataQuiz = await prisma.quiz.findFirst({
    where: {
      id: Number(id_quiz),
    },
    include: {
      pertanyaan: true,
    },
  });

  const dataPertanyaan = await prisma.pertanyaan.findUnique({
    where: {
      id: Number(id_pertanyaan),
    },
  });

  const jawaban = await prisma.jawaban_peserta.findFirst({
    where: {
      id_pertanyaan: Number(id_pertanyaan),
    },
  });

  let point: number = 0;
  if (dataPertanyaan?.jawaban_benar === Number(jawaban_peserta)) {
    point += 10;
  } else {
    point += 0;
  }

  let hasil: number = point / dataQuiz!.pertanyaan.length;

  if (!jawaban) {
    const data = await prisma.jawaban_peserta.create({
      data: {
        id_user: Number(id_user),
        id_quiz: Number(id_quiz),
        id_pertanyaan: Number(id_pertanyaan),
        jawaban_peserta: Number(jawaban_peserta),
        skor: hasil,
      },
    });

    return res.status(200).json({
      message: "data berhasil ditambahkan",
      data: data,
    });
  } else {
    const data = await prisma.jawaban_peserta.update({
      data: {
        id_user: Number(id_user),
        id_quiz: Number(id_quiz),
        id_pertanyaan: Number(id_pertanyaan),
        jawaban_peserta: Number(jawaban_peserta),
        skor: point,
      },
      where: {
        id: jawaban.id,
      },
    });

    return res.status(200).json({
      message: "data berhasil diubah",
      data: data,
    });
  }
};

export const getAllJawaban = async (req: Request, res: Response) => {
  const data = await prisma.jawaban_peserta.findMany();
  if (data.length == 0)
    return res.status(404).json({
      message: "data masih kosong",
      data: [],
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

export const getJawabanByUserId = async (req: Request, res: Response) => {
  const { id_quiz, id_user } = req.query;
  const data = await prisma.jawaban_peserta.findFirst({
    where: {
      id_quiz: Number(id_quiz),
      id_user: Number(id_user),
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
