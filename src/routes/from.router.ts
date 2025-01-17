import express from "express";
import { deleteDetail, getFromDetails, submitFrom, updateDetail } from "../controller/from.controller";

const router = express.Router();

// POST route to handle form submission
router.post("/submitFrom", submitFrom);
router.get("/fromDetails", getFromDetails);
router.patch("/updateDetails/:id",updateDetail);
router.delete("/deleteDetails/:id",deleteDetail);

export default router;
