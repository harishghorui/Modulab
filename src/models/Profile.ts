import { Schema, model, models } from 'mongoose';

const ProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
  },
  headline: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    default: '',
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
  },
}, { timestamps: true });

const Profile = models.Profile || model('Profile', ProfileSchema);

export default Profile;
