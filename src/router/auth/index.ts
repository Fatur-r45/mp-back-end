import express from "express";
import { getUsers, getUserById, login, register } from "../../controller/auth";
import { accessValidation } from "../../middleware/validatoinToken";

const router = express.Router();

router.get("/users", accessValidation, getUsers);
router.get("/users/:id", accessValidation, getUserById);
router.post("/register", register);
router.post("/login", login);

export default router;
