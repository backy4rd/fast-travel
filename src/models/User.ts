import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { Document, Schema, model, Model } from 'mongoose';
import { IUserBase } from '../interfaces/IUser';
import formatName from '../utils/name_formater';

const SALT_ROUND = parseInt(process.env.SALT_ROUND);

export interface IUser extends IUserBase, Document {
  comparePassword(password: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  genUUID(): string;
}

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: 'Email is required',
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Invalid email address',
      ],
      index: { unique: true },
    },
    password: {
      type: String,
      required: 'Password is required',
      minlength: [6, 'Password must have at least 6 character'],
      maxlengthx: [32, 'Password to long'],
      match: [/^[^\s]+$/, 'Password cannot contain white space'],
    },
    uuid: {
      type: String,
      match: [
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        'Invalid UUID format',
      ],
    },
    profile: {
      firstName: {
        type: String,
        required: 'First name is required',
        match: [/^[a-zA-Z\s]+$/, 'First name contained invalid character'],
      },
      lastName: {
        type: String,
        required: 'Last name is required',
        match: [/^[a-zA-Z\s]+$/, 'Last name contained invalid character'],
      },
    },
    urls: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Url',
        required: true,
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

// Hooks
UserSchema.post<IUser>('validate', async function () {
  this.profile.firstName = formatName(this.profile.firstName);
  this.profile.lastName = formatName(this.profile.lastName);
});

UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, SALT_ROUND);
});

// Methods
UserSchema.statics.genUUID = function () {
  return uuid.v4();
};

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = model<IUser, IUserModel>('User', UserSchema);

export default User;
