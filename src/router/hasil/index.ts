import express from "express";
import {
  getAllHasilJawaban,
  getHasilJawabanByUserId,
  postHasilJawaban,
} from "../../controller/hasil";
const router = express.Router();

router.get("/hasil", getAllHasilJawaban);
router.post("/hasil", postHasilJawaban);
router.get("/hasil/:id", getHasilJawabanByUserId);

export default router;
