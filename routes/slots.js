// routes/slots.js
import express from "express";
import { getFreeSlots } from "../controllers/slotsController.js";

const router = express.Router();

router.get("/", getFreeSlots);

export default router;
