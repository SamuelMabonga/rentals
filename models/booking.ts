import { Schema, model, models } from "mongoose";

const BookingShema = new Schema({
  name: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
  },
  additionalFeatures: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PropertyFeatures',
    }
  ],
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String
  }
}, {
  timestamps: true
});

const Booking = models.Booking || model("Booking", BookingShema);

export default Booking;
