import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(express.json());

// routes
app.use("/auth", authRoutes);

// port
const port = process.env.PORT || 4000;

// getting start function
async function start() {
  try {
    await AppDataSource.initialize();
    console.log("---- Data Source has been intialized ----");
    app.get("/", (req: any, res: any) => res.send("API is running"));

    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error(
      "xxxxxxxxxx Error during Data Source initialization xxxxxxxxx",
      err
    );
    process.exit(1);
  }
}
start();
