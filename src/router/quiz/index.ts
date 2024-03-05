import express from "express";
import {
  deleteQuiz,
  getAllQuiz,
  getQuizById,
  postQuiz,
  putQuiz,
} from "../../controller/quiz";
import { roleValidation } from "../../middleware/rolevalidation";
import { token } from "../../controller/token";

const router = express.Router();

router.get("/token", token);
router.post("/quiz", roleValidation, postQuiz);
router.get("/quiz", getAllQuiz);
router.get("/quiz/:id", getQuizById);
router.put("/quiz/:id", roleValidation, putQuiz);
router.delete("/quiz/:id", roleValidation, deleteQuiz);

export default router;
