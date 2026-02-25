

// AuthController.js
import bcrypt from "bcrypt";
import pool from "../db.js";

export const registersa = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'superadmin')",
      [email, hash]
    );

    res.json({ message: "Superadmin created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};


export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    // Optional: prevent admin from creating superadmin
    if (req.user.role === "admin" && role === "superadmin") {
      return res.status(403).json({ message: "Admin cannot create superadmin" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)",
      [email, hash, role]
    );

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};
