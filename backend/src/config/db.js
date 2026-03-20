import {neon} from '@neondatabase/serverless';

import "dotenv/config";

//create a sql connection using database url
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        // Decimal(10, 2) means that the amount can have up to 10 digits in total, 
        // with 2 of those digits being after the decimal point. 
        // This allows for a wide range of values while ensuring that 
        // the amount is stored with two decimal places, which is common for financial data.
        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing DB: ", error);
        process.exit(1); //status code 1 indicates failure so exits the process and 0 indicates success
    }
}
