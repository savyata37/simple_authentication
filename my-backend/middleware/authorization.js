// middileware/authorization.js


import pool from "../db.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export const blockAdminOverSuperAdmin = async (req, res, next) => {
  const targetUserId = req.params.id;

  const { rows } = await pool.query("SELECT role FROM users WHERE id=$1", [targetUserId]);
  const target = rows[0];

  if (req.user.role === "admin" && target?.role === "superadmin") {
    return res.status(403).json({ message: "Admins cannot modify superadmins" });
  }

  next();
};

export const ensureSingleSuperAdmin = async (req, res, next) => {
  const { rows } = await pool.query("SELECT COUNT(*) FROM users WHERE role='superadmin'");
  if (Number(rows[0].count) >= 1) {
    return res.status(403).json({ message: "Superadmin already exists" });
  }
  next();
};

// export const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: "Too many login attempts. Try again later."
// });
