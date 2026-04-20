import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a unique slug'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
}, { timestamps: true });

const Category = models.Category || model('Category', CategorySchema);

export default Category;
