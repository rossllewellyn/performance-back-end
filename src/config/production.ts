import { Config } from "./types";
import dotenv from "dotenv";

dotenv.config();

// typically set these in cloud, CI/CD, docker (etc) secrets or env 
// variables as running production env locally is human-error prone
// e.g. mixing up yarn develop with yarn start and running a migration
const databaseUrl = process.env.PROD_DATABASE_URL as string;
const authSecret = process.env.PROD_AUTH_SECRET as string;
const frontendUrl = process.env.PROD_FRONTEND_URL as string;

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