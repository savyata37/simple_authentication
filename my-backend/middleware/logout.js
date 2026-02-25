// middleware/logout.js

import pool from "../db.js"; 
export const logout = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: "No refresh token provided" });

    // Remove refresh token from DB
    await pool.query("UPDATE users SET refresh_token = NULL WHERE refresh_token = $1", [refreshToken]);

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Logout failed" });
  }
};
