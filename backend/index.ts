import express from "express";
import config from "./config";
import { cors } from "./middleware";
import { connectDB } from "./database";
import userRouter from "./routers/user";

const app = express();

// Middleware
app.use(cors);
app.use(express.json());

app.use("/api/user", userRouter);

// Connect to database
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Book Selling API is running!" });
});

const PORT = config.HOST_API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});