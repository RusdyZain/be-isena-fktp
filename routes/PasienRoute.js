import express from "express";
import {
  getPasiens,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
} from "../controllers/Pasiens.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/pasiens", verifyToken, verifyUser, getPasiens);
router.get("/pasiens/:id", verifyToken, verifyUser, getPasienById);
router.post("/pasiens", verifyToken, verifyUser, adminOnly, createPasien);
router.patch("/pasiens/:id", verifyToken, verifyUser, adminOnly, updatePasien);
router.delete("/pasiens/:id", verifyToken, verifyUser, adminOnly, deletePasien);

export default router;
