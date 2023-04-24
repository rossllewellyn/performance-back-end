import { Config } from "./types";
import dotenv from "dotenv";

dotenv.config();

// OK to set in .env as connecting to local (or staging) db
const databaseUrl = process.env.LOCAL_DATABASE_URL as string;
const authSecret = process.env.LOCAL_AUTH_SECRET as string;
const frontendUrl = process.env.LOCAL_FRONTEND_URL as string;

const config: Config = {
    database: {
        uri: databaseUrl
    },
    auth: {
        secret: authSecret
    },
    frontend: {
        selfUrl: frontendUrl
    }
}

export default config;