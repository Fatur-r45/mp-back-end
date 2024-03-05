import express from "express";
import {
  deletePertanyaanById,
  getAllPertanyaan,
  getPertanyaanById,
  postPertanyaan,
  putPertanyaan,
} from "../../controller/pertanyaan";
import { roleValidation } from "../../middleware/rolevalidation";
const router = express.Router();

router.get("/pertanyaan", getAllPertanyaan);
router.get("/pertanyaan/:id", getPertanyaanById);
router.post("/pertanyaan", roleValidation, postPertanyaan);
router.put("/pertanyaan/:id", roleValidation, putPertanyaan);
router.delete("/pertanyaan/:id", roleValidation, deletePertanyaanById);

export default router;
