import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runSchema = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT || 3306),
            ssl: process.env.DB_SSL === "true"
                ? {
                    minVersion: "TLSv1.2",
                    rejectUnauthorized: true
                }
                : undefined,
            multipleStatements: true
        });

        const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

        console.log(`Connecting to ${process.env.DB_NAME} at ${process.env.DB_HOST}...`);
        await connection.query(schema);
        console.log("Schema applied successfully: users, stores, ratings tables created.");

    } catch (error) {
        console.error("Error applying schema:", error);
        process.exitCode = 1;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

runSchema();