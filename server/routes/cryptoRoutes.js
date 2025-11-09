import express from "express";
import { getTopCryptos } from "./controllers/cryptoController.js";

const router = express.Router();

router.get("/prices", getTopCryptos);

export default router;
