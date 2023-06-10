import { Schema, model, models } from "mongoose";

const BookingSchema = new Schema({
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
    type: String,
    default: "PENDING",
    enum: [
      "PENDING",
      "ACCEPTED",
      "REJECTED"
    ]
  },
}, {
  timestamps: true
});

//indexed fields for searching
BookingSchema.index({
  name: "text",
});

const Booking = models.Booking || model("Booking", BookingSchema);

export default Booking;
