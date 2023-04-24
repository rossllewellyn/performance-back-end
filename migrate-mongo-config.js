const dotenv = require("dotenv");

dotenv.config();

const databaseUrl = process.env.LOCAL_DATABASE_URL;
const databaseName = process.env.DATABASE_NAME;

const config = {
  mongodb: {
    url: databaseUrl,
    databaseName: databaseName,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: "build/database/migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js"
};

module.exports = config;