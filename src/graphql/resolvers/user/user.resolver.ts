import { Resolver, Query, Mutation, Ctx, Arg, FieldResolver, Root, UseMiddleware } from "type-graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./user.type";
import Context from "../../context";
import config from "../../../config";
import auth from "../../../middleware/auth";
import { ApolloError } from "apollo-server-express";

@Resolver(User)
export default class UserResolver {
    /**
     * Me Query
     */
    @Query(returns => User)
    @UseMiddleware(auth)
    async me(@Ctx() { database, userId }: Context): Promise<User> {
        const user = await database.UserModel.findById(userId);

        if (!user) {
            throw new ApolloError("User does not exist", "404");
        }

        return {
            id: user._id,
            name: user.name,
            inbox: undefined,
            unreadMessageCount: undefined,
        };
    }

    /**
     * User's inbox
     */
    @FieldResolver()
    async inbox(@Root() user: User, @Ctx() { database, userId }: Context): Promise<User["inbox"]> {
        // lookup the messages for a user from messages table
        const messages = await database.MessageModel.find({ to: userId });

        return messages.map(message => ({
            id: message.id,
            contents: message.contents,
            to: message.to as any,
            from: message.from as any,
            archived: message.archived
        }));
    }

    /**
     * Unread message count for a user
     */
    @FieldResolver()
    async unreadMessageCount(
        @Root() user: User,
        @Ctx() { database, userId }: Context,
    ): Promise<User["unreadMessageCount"]> {
        // do a count on the DB for messages count
        const count = await database.MessageModel.find({ to: userId });
        return count.length;
    }

    /**
     * Login mutation
     */
    @Mutation(returns => String)
    async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { database }: Context) {
        const record = await database.UserModel.findOne({ email });
        const correct = await bcrypt.compare(password, record.password);

        if (!correct) {
            throw new ApolloError("Invalid credentials", "401");
        }

        return jwt.sign({ userId: record._id }, config.auth.secret, { expiresIn: "1h" });
    }

    /**
     * Register new user
     */
    @Mutation(returns => String)
    async register(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { database }: Context) {
        const existing = await database.UserModel.findOne({ email });

        // small privacy issue, non-owner of email address
        // can determine if owner is signed up to the site/app
        if (existing) {
            throw new ApolloError("User exists!", "409");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await database.UserModel.create({
            email,
            password: hash,
        });

        return jwt.sign({ userId: user._id }, config.auth.secret, { expiresIn: "1h" });
    }
}
