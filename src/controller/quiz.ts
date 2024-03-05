import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const postQuiz = async (req: Request, res: Response) => {
  const { judul, deskripsi, mulai, selesai } = req.body;
  const waktuMulai = new Date(mulai);
  const waktuSelesai = new Date(selesai);

  if (!judul && !deskripsi && !mulai && !selesai)
    return res.status(400).json({ error: "semua fields harus terisi" });

  if (isNaN(waktuMulai.getTime()) || isNaN(waktuSelesai.getTime())) {
    return res.status(400).json({ message: "Invalid date format." });
  }

  const result = await prisma.quiz.create({
    data: {
      judul,
      deskripsi,
      waktu_mulai: waktuMulai,
      waktu_selesai: waktuSelesai,
    },
  });
  return res.status(200).json({
    message: "data berhasil di tambahkan",
    data: result,
  });
};

export const getAllQuiz = async (req: Request, res: Response) => {
  const result = await prisma.quiz.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      pertanyaan: true,
    },
  });
  return res.status(200).json({
    message: "data berhasil di ambil",
    data: result,
  });
};

export const getQuizById = async (req: Request, res: Response) => {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      pertanyaan: true,
    },
  });

  if (!quiz)
    return res
      .status(404)
      .json({ data: `tidak ada data dengan id ${req.params.id}` });
  try {
    return res.status(200).json({
      message: "data berhasil di ambil",
      data: quiz,
    });
  } catch (error) {
    res.status(404).json({
      message: "data tidak ditemukan",
    });
  }
};

export const putQuiz = async (req: Request, res: Response) => {
  const { judul, deskripsi, mulai, selesai } = req.body;
  if (!judul && !deskripsi && !mulai && !selesai)
    return res.status(400).json({ error: "semua fields harus terisi" });

  const quiz = await prisma.quiz.update({
    data: {
      judul,
      deskripsi,
      waktu_mulai: new Date(mulai),
      waktu_selesai: new Date(selesai),
    },
    where: {
      id: Number(req.params.id),
    },
  });
  try {
    res.status(200).json({
      message: "data berhasild di ubha",
      data: quiz,
    });
  } catch (err) {
    return res.status(402).json({
      message: "data gagal di ubah",
    });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    await prisma.quiz
      .delete({
        where: {
          id: Number(req.params.id),
        },
      })
      .then((result) => {
        return res.status(200).json({
          message: "data berhasil di hapus",
          data: result,
        });
      });
  } catch (error) {
    return res.status(404).json({
      message: "data gagal di hapus",
    });
  }
};
