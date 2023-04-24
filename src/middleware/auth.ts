import { MiddlewareFn } from "type-graphql";
import Context from "../graphql/context";
import jwt from "jsonwebtoken";
import config from "../config";

const auth: MiddlewareFn<Context> = ({ context }, next) => {
  const authHeader = context.req.headers?.authorization;
  
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, config.auth.secret);
  // @ts-ignore
  context.userId = decodedToken.userId;

  return next();
}

export default auth;