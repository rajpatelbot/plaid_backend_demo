import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
  PLAID_SECRET: process.env.PLAID_SECRET,
  PLAID_ENV: process.env.PLAID_ENV,
  PLAID_PRODUCTS: process.env.PLAID_PRODUCTS,
  PLAID_COUNTRY_CODES: process.env.PLAID_COUNTRY_CODES,

  // USER: process.env.USER,
  // PASSWORD: process.env.PASSWORD,
  // HOST: process.env.HOST,
  // DATABASE: process.env.DATABASE,

  // Validates that all required environment variables are set before starting up server
  validate() {
    // Add required environment variables here
    const required = [
      "PORT",
      "FRONTEND_ORIGIN",
      "PLAID_CLIENT_ID",
      "PLAID_SECRET",
      "PLAID_ENV",
      "PLAID_PRODUCTS",
      "PLAID_COUNTRY_CODES",
      // "USER",
      // "PASSWORD",
      // "HOST",
      // "DATABASE",
    ];

    for (const variable of required) {
      if (!process.env[variable]) {
        // eslint-disable-next-line no-console
        console.log(`Missing required environment variable: ${variable}`);
        return false;
      }
    }

    return true;
  },
};
