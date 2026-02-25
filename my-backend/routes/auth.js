// routes/auth.js
import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import { login } from "../middleware/login.js";
import { logout } from "../middleware/logout.js";
import { ensureSingleSuperAdmin } from "../middleware/authorization.js";
import { registersa, register } from "../controller/AuthController.js";
import { refreshToken } from "../middleware/refreshtoken.js";
import { authenticate } from "../middleware/token.js";
import { authorize } from "../middleware/authorization.js";


const router = express.Router();

// POST /api/auth/register-superadmin (one-time)
router.post("/register-superadmin", ensureSingleSuperAdmin, registersa) 


router.post(
  "/register",
  authenticate,                // verify JWT
  authorize("admin", "superadmin"), // allow only admin or superadmin
  register
);

// GET /api/auth/refresh-token
router.get("/refresh-token", refreshToken);

// POST /api/auth/login
router.post("/login", login);

// // POST /api/auth/logout
router.post("/logout", logout);

export default router;
