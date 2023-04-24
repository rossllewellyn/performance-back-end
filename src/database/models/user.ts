import { prop, getModelForClass, index, Ref } from '@typegoose/typegoose';
import { Message } from "./message";

@index({ email: 1 })
@index({ password: 1 })
export class User {
    @prop()
    public name?: string;

    @prop()
    public email!: string;

    @prop()
    public password!: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
