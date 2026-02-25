// middleware/login.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db.js";


export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = (await pool.query("SELECT * FROM users WHERE email=$1", [email])).rows[0];
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );

  
  const result = await pool.query(
    "UPDATE users SET refresh_token=$1 WHERE id=$2",
    [refreshToken, user.id]
  );
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken, role: user.role });
};
