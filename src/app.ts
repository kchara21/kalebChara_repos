import "reflect-metadata";
import express, { Application } from "express";
import cors from "cors";
import routes from "./routes/index.route";
import helmet from "helmet";

const app = express();
app.use(express.json());

app.use(cors({ credentials: true }));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(express.urlencoded({ extended: false }));

app.use("/", routes);

export default app;
