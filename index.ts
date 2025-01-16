import express, { Application } from "express";
import cors from "cors";
import env from "dotenv";
import { dbConfig } from "./utils/dbConfig";
import { mainApp } from "./mainApp";
env.config();

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://lasttestfe.onrender.com"],
    methods: ["POST", "GET", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
mainApp(app);
app.listen(parseInt(process.env.PORT as string), () => {
  dbConfig();
});
