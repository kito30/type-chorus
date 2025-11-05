import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, trim: true },
    password_hash: { type: String, required: true },
    recentSong: {
      id: { type: Number },
      trackName: { type: String },
      artistName: { type: String },
      albumName: { type: String },
      playedAt: { type: Number },
    },
    scores: [
      {
        id: { type: Number, required: true },
        trackName: { type: String, required: true },
        artistName: { type: String, required: true },
        albumName: { type: String },
        score: { type: Number, required: true },
        playedAt: { type: Number, required: true },
      },
    ],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

// Normalize toJSON to expose id instead of _id
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password_hash;
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
