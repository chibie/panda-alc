import mongoose from 'mongoose';

const LEVELS = ['junior', 'senior'];
const GENDERS = ['male', 'female'];

const studentSchema = new mongoose.Schema({
  name: {
    first: {type: String, required: true},
    last: {type: String, required: true},
    others: String,
  },
  gender: {type: String, enum: GENDERS},
  dateOfBirth: {type: Date, required: true},
  photoFileName: {type: String, required: true},
  class_: {type: Number, required: true, min: 1, max: 3},
  level: {type: String, enum: LEVELS, required: true},
  subjects: [String],
},
{// schema options
  timestamps: true,
});

export default mongoose.model('Student', studentSchema);
