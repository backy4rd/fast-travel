import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { Document, Schema, model, Model } from 'mongoose';
import { IUserBase } from '../interfaces/IUser';
import formatName from '../utils/name_formater';

const SALT_ROUND = parseInt(process.env.SALT_ROUND);

export interface IUser extends IUserBase, Document {
  comparePassword(password: string): Promise<boolean>;
  changePassword(newPassword: string): Promise<void>;
}

interface IUserModel extends Model<IUser> {
  genUUID(): string;
  isEmailWasRegistered(email: string): Promise<boolean>;
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
      index: true,
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
      default: null,
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

// Static methods
UserSchema.statics.genUUID = function () {
  return uuid.v4();
};

UserSchema.statics.isEmailWasRegistered = async function (email: string) {
  return this.exists({ email: email });
};

// Methods
UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.changePassword = async function (newPassword: string) {
  this.password = newPassword;
  await this.save();
};

const User = model<IUser, IUserModel>('User', UserSchema);

export default User;
