import { prop, Ref, getModelForClass, index } from '@typegoose/typegoose';
import { User } from "./user";

@index({ to: 1, archived: 1 })
@index({ from: 1, archived: 1 })
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