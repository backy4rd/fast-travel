import { Document, Schema, model } from 'mongoose';
import { IUserBase } from '../interfaces/IUser';

export interface IUser extends IUserBase, Document {}

export const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    urls: [{ type: Schema.Types.ObjectId, ref: 'Url', required: true }],
  },
  { timestamps: true },
);

const User = model<IUser>('User', UserSchema);

export default User;
