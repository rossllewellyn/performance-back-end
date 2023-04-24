import { prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { User } from "./user";

export class Message {
    @prop({ ref: User })
    public from!: Ref<User>;

    @prop({ ref: User })
    public to!: Ref<User>;

    @prop()
    public contents!: string;

    @prop()
    public archived!: boolean;
}

const MessageModel = getModelForClass(Message);

export default MessageModel;
