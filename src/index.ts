import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { auth, hasil, jawaban, pertanyaan, quiz } from "./router";

const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());

app.use(auth);
app.use(quiz);
app.use(pertanyaan);
app.use(jawaban);
app.use(hasil);

app.listen(PORT, () => {
  console.log(`server runing in PORT: ${PORT}`);
});
