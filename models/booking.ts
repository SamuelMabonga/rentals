import { Schema, model, models } from "mongoose";

const BookingShema = new Schema({
  name: {
    required: true,
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
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  }
});

const Booking = models.Booking || model("Booking", BookingShema);

export default Booking;
