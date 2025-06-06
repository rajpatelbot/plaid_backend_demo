import { env } from "@/config/env";
import { createPool, Pool } from "mysql2/promise";

const dbConfig = {
    // host: env.HOST,
    // user: env.USER,
    // password: env.PASSWORD,
    // database: env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}

let pool: Pool;

export const initDB = async () => {
    try {
        pool = createPool(dbConfig);
        console.log("Database connection pool created successfully.");

        // Test the connection
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log("Database connection successfully established.");
    } catch (error) {
        console.error("MySQL connection error:", error);
        process.exit(1);
    }
}

export const getConnection = async () => {
    return await pool.getConnection();
}

export const closeDB = async () => {
    if (pool) {
        await pool.end();
        console.log("Database connection pool closed successfully.");
    }
}
