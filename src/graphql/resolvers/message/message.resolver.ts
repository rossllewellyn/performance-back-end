import { Resolver, Mutation, Ctx, Root, Arg, FieldResolver, UseMiddleware } from "type-graphql";
import Message from "./message.type";
import User from "../user/user.type";
import Context from "../../context";
import { random } from "../../../utils/math";
import auth from "../../../middleware/auth";
import { ApolloError } from "apollo-server-express";
const randomSentence = require("random-sentence");

@Resolver(Message)
export default class MessageResolver {
    /**
     * Looks up and returns the recipient
     */
    @FieldResolver()
    async to(@Root() { to }: Message, @Ctx() { database }: Context): Promise<User | null> {
        if (!to) {
            return null;
        }

        const user = await database.UserModel.findById(to.id);

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            unreadMessageCount: undefined,
            inbox: undefined,
        };
    }

    /**
     * Looks up and returns the sender
     */
    @FieldResolver()
    async from(@Root() { from }: Message, @Ctx() { database }: Context): Promise<User | null> {
        if (!from) {
            return null;
        }

        const user = await database.UserModel.findById(from.id);

        console.log(`User found!`, user);

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            unreadMessageCount: undefined,
            inbox: undefined,
        };
    }

    /**
     * Sends a message to a random user
     */
    @Mutation(type => Message)
    @UseMiddleware(auth)
    async sendRandomMessage(@Ctx() { database, userId }: Context, @Arg("message") message: string): Promise<Message> {
        const count = await database.UserModel.countDocuments({});
        const to = await database.UserModel.findOne({ _id: { $ne: userId } })
            .skip(random(0, count))
            .select("_id");

        const record = await database.MessageModel.create({
            from: userId,
            to: to?._id,
            contents: message,
            archived: false
        });

        return {
            id: record.id,
            contents: message,
            to: to?._id,
            from: userId as any,
            archived: false
        };
    }

    /**
     * Mark message as archived
     */
    @Mutation(type => Message)
    @UseMiddleware(auth)
    async archiveMessage(@Arg("messageId") messageId: string, @Ctx() { database }: Context) {
        try {
            const message = await database.MessageModel.findByIdAndUpdate(
                messageId, 
                { archived: true }, 
                { new: true }
            );

            return message;
        } catch (error) {
            throw new ApolloError("Failed to archive message", "500");
        }

    }
}
