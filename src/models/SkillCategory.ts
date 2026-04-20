import { Schema, model, models } from 'mongoose';

const SkillCategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a skill category name'],
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
}, { timestamps: true });

// Ensure a user can't have duplicate category names
SkillCategorySchema.index({ name: 1, userId: 1 }, { unique: true });

const SkillCategory = models.SkillCategory || model('SkillCategory', SkillCategorySchema);

export default SkillCategory;
