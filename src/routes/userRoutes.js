import express from "express";
import UserRepository from "../repository/userRepository.js";
const router = express.Router();
const userRepository = new UserRepository();
const app = express();
import mid from "../utils/restrict.js";
import { validateLoginUser } from "../utils/validator.js";
import passport from "../utils/passport.js";

app.use(passport.initialize());
app.use(passport.session());

router.get("/auth/google", userRepository.googleLogin);

router.get("/auth/google/callback", userRepository.googleCallback);

router.get("/", async (req, res) => {
  return await userRepository.findAll(req, res);
});

router.get("/:id", async (req, res) => {
  return await userRepository.findById(req, res);
});

router.post("/register", async (req, res) => {
  return await userRepository.create(req, res);
});

router.post("/login", async (req, res) => {
  return userRepository.login(req, res);
});

export const userRoutes = router;
