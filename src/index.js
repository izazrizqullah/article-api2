import "dotenv/config";
import express from "express";
import "reflect-metadata";
import morgan from "morgan";
import { AppDataSource } from "./config/database.js";
import { userRoutes } from "./routes/userRoutes.js";
import { roleRoutes } from "./routes/roleRoutes.js";
import SwaggerUI from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";

const PORT = 3005;

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerFile = path.join(__dirname, "../swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFile, "utf8"));
app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

app.get("/", (_req, res) => res.send("Welcome to our API!"));

app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);

// handler 404
app.use((_req, res) => {
  res.json({
    status: false,
    message: "Are you lost?",
  });
});

// handler
app.use((err, _req, res) => {
  res.json({
    status: false,
    message: `Internal Server Error + ${err.message}`,
  });
});

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
