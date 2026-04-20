import { Schema, model, models } from 'mongoose';

const SkillSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a skill name'],
    trim: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'SkillCategory',
    required: [true, 'Please specify a skill category'],
  },
  icon: {
    type: String,
    required: [true, 'Please provide a skill icon class'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
}, { timestamps: true });

// Ensure a user can't have duplicate skill names
SkillSchema.index({ name: 1, userId: 1 }, { unique: true });

const Skill = models.Skill || model('Skill', SkillSchema);

export default Skill;
