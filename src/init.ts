import "reflect-metadata"; // this ensures type graphql works properly
import jwt from "express-jwt";
import expressPlayground from "graphql-playground-middleware-express";
import express from "express";
import getDatabase from "./database";
import createGraphqlServer from "./graphql";
import config from "./config";
import rateLimit from "express-rate-limit";

const FIVE_MINUTES = 5 * 60 * 1000;

const init = async () => {
    const app = express();
    const db = await getDatabase(config.database);
    console.log(`DB connected to ${config.database.uri}!`);
    const server = await createGraphqlServer(db);

    const limiter = rateLimit({
        windowMs: FIVE_MINUTES,
        max: 100
    });

    const path = "/graphql";

    app.use(
        path,
        jwt({
            secret: config.auth.secret,
            credentialsRequired: false,
            algorithms: ["HS256"],
        }),
        // doesn't play nice with artillery!
        limiter
    );

    // for debugging
    app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

    server.applyMiddleware({ app, path });

    app.listen(5000);
    console.log(`App listening on port 5000!`);
};

init();
