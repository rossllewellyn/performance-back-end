import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Database } from "../database";
import { Request } from "express";

class Context {
    public userId?: string;
    public isAuthenticated?: boolean;
    public req: Request;

    constructor(public database: Database, expressContext: ExpressContext) {
        this.req = expressContext.req;
        const user = this.req.user as Creds;

        if (user) {
            this.userId = user.userId;
            this.isAuthenticated = true;
        }
    }
}

export default Context;

type Creds = {
    userId: string;
    iat: number;
};
