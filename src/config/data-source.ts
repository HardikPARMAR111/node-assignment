import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing in your .env file");
}

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGO_URI as string,
  synchronize: true,
  logging: false,
  entities: [User],
});
