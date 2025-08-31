import mongoose from 'mongoose';

const RouteHistorySchema = new mongoose.Schema(
  {
    start: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    end: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    distance: Number,
    fuelCost: Number,
  },
  { timestamps: true }
);

export const RouteHistory = mongoose.model('RouteHistory', RouteHistorySchema);
