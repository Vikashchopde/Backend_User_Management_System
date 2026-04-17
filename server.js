import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoute.js";
import userRoutes from "./src/routes/userRoute.js";
import morgan from "morgan";
dotenv.config();

// middleware
const app = express();
app.use(cors({
  origin: "https://frontend-lemon-sigma-28.vercel.app",
}));
app.use(morgan("dev"));
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


// test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// DB connect
connectDB();

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));