// app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
// import your middlewares
import { authenticate } from "./middleware/token.js";
import { authorize, blockAdminOverSuperAdmin } from "./middleware/authorization.js";

//  Create express app
const app = express();

// use cookies
app.use(cookieParser());

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// //  Routes
// app.post("/api/superadmin/create-admin",
//   authenticate,
//   authorize("superadmin"),
//   (req, res) => res.json({ ok: true })
// );



// app.delete("/api/admin/delete-user/:id",
//   authenticate,
//   authorize("superadmin", "admin"),
//   blockAdminOverSuperAdmin,
//   (req, res) => res.json({ deleted: true })
// );

app.use("/api/auth", authRoutes);

//  Export default
export default app;
