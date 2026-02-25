// middleware/refreshToken.js
import jwt from "jsonwebtoken";
import pool from "../db.js";

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    // Find the user in DB by refresh token
    const { rows } = await pool.query("SELECT id, role FROM users WHERE refresh_token=$1", [token]);
    const user = rows[0];

    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    // Verify token
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
      if (err) return res.status(403).json({ message: "Refresh token expired or invalid" });

      // Issue a new access token
      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRE }
      );

      res.json({ accessToken, role: user.role });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not refresh token" });
  }
};