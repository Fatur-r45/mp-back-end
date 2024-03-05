import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const postPertanyaan = async (req: Request, res: Response) => {
  const { pertanyaan, opsiA, opsiB, opsiC, opsiD, jawaban, id_quiz } = req.body;
  if (
    !pertanyaan ||
    !opsiA ||
    !opsiB ||
    !opsiC ||
    !opsiD ||
    !jawaban ||
    !id_quiz
  )
    return res.status(400).json({
      message: "semua field harus di isi",
    });
  const opsiJawaban = [opsiA, opsiB, opsiC, opsiD].join("~");
  const data = await prisma.pertanyaan.create({
    data: {
      pertanyaan,
      opsi_jawaban: opsiJawaban,
      jawaban_benar: Number(jawaban),
      id_quiz: Number(id_quiz),
    },
  });
  try {
    return res.status(200).json({
      message: "data berhasil di tambahkan",
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllPertanyaan = async (req: Request, res: Response) => {
  const data = await prisma.pertanyaan.findMany();
  if (data.length == 0)
    return res.status(200).json({
      message: "dat masih kosong",
      data: [],
    });
  return res.status(200).json({
    message: "data berhasil di ambil",
    data,
  });
};

export const getPertanyaanById = async (req: Request, res: Response) => {
  try {
    await prisma.pertanyaan
      .findUnique({
        where: {
          id: Number(req.params.id),
        },
      })
      .then((result) => {
        if (!result)
          return res.status(404).json({
            message: `tidak ada data dengan id ${req.params.id}`,
          });
        return res.status(200).json({
          message: "data berhasil di ambil",
          data: result,
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    console.log(error);
  }
};

export const putPertanyaan = async (req: Request, res: Response) => {
  const { pertanyaan, opsiA, opsiB, opsiC, opsiD, jawaban, id_quiz } = req.body;
  if (
    !pertanyaan ||
    !opsiA ||
    !opsiB ||
    !opsiC ||
    !opsiD ||
    !jawaban ||
    !id_quiz
  )
    return res.status(400).json({
      message: "semua field harus di isi",
    });
  const opsiJawaban = [opsiA, opsiB, opsiC, opsiD].join("~");
  const data = await prisma.pertanyaan.update({
    data: {
      pertanyaan,
      opsi_jawaban: opsiJawaban,
      jawaban_benar: Number(jawaban),
      id_quiz: Number(id_quiz),
    },
    where: {
      id: Number(req.params.id),
    },
  });
  if (!data)
    return res.status(404).json({
      message: "data gagal di ubah",
    });
  try {
    return res.status(200).json({
      message: `data dengan ${req.params.id} berhasil di ubah`,
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const deletePertanyaanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await prisma.pertanyaan.delete({
    where: {
      id: Number(id),
    },
  });
  try {
    return res.status(200).json({
      message: "data berhasil di hapus",
      data,
    });
  } catch (err) {
    console.log(err);
  }
};
