import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  fullName: string;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;
