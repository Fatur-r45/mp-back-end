import express from "express";
import { getAllJawaban, postJawaban } from "../../controller/jawaban";

const router = express.Router();

router.get("/jawaban", getAllJawaban);
router.get("/jawaban/", getAllJawaban);
router.post("/jawaban", postJawaban);

export default router;
