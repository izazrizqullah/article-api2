import { DataSource } from "typeorm";
import { UserEntity } from "../entities/user.js";
import { PostEntity } from "../entities/posts.js";
import { RoleEntity } from "../entities/role.js";
import { TokenEntity } from "../entities/token.js";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: ["src/entities/*.js"],
  migrations: ["src/migrations/*.js"],
});
