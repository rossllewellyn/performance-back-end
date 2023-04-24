import { MiddlewareFn } from "type-graphql";
import Context, { Creds } from "../graphql/context";
import jwt from "jsonwebtoken";
import config from "../config";
import { ApolloError } from "apollo-server-express";

const auth: MiddlewareFn<Context> = ({ context }, next) => {
  const authHeader = context.req.headers?.authorization;

  if (!authHeader) throw new ApolloError("No token", "401");
  
  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.auth.secret) as DecodedToken;
    console.log(decodedToken);
    context.userId = decodedToken.userId;

    return next();
  } catch (error) {
    throw new ApolloError("Not authorised", "401");
  }
}

export default auth;

type DecodedToken = Creds & {
  exp: number;
}