import RoleRepository from "../repository/roleRepository.js";
const roleRepository = new RoleRepository();
import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  return await roleRepository.createRole(req, res);
});

router.delete("/:id", async (req, res) => {
  return await roleRepository.deleteRole(req, res);
});

export const roleRoutes = router;
