import mongoose, { Document } from "mongoose";

enum Gender { Male = 'male', Female = 'female' }

export interface IUser extends Document {
    name: string;
    username: string;
    token?: string;
    photo?: string;
    age: number;
    gender: Gender;
    inLoveWith?: string;
    createdAt?: Date;
    updatedAt?: Date;

}

const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    username: { type: String, required: true },
    token: { type: String },
    photo: { type: String },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female'] },
    inLoveWith: { type: String }
    
}, { timestamps: true })

const User = mongoose.model('UserModel', UserSchema);
export default User
