import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export const Favorite = mongoose.model('Favorite', FavoriteSchema);
