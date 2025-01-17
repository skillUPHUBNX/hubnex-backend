import express, { Request, Response } from "express";
import { LOGIN } from "../controller/admin.controller";
import { isAuthenticated, verifyJwt } from "../middlewares/auth.middleware";


const router = express.Router();

// POST route to handle form submission
router.post("/login", LOGIN);
router.post("/logout",verifyJwt,isAuthenticated, LOGIN);

export default router;
