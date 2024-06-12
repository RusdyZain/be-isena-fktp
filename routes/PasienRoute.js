import express from "express";
import {
    getPasiens,
    getPasienById,
    createPasien,
    updatePasien,
    deletePasien
} from "../controllers/Pasiens.js";
import { verifyUser, adminOnly, klinikOnly } from "../middleware/AuthUser.js";


const router = express.Router();

router.get('/pasiens', verifyUser,  getPasiens);
router.get('/pasiens/:id', verifyUser,   getPasienById);
router.post('/pasiens', verifyUser, adminOnly,  createPasien);
router.patch('/pasiens/:id', verifyUser, adminOnly,  updatePasien);
router.delete('/pasiens/:id', verifyUser, adminOnly,  deletePasien);

export default router;