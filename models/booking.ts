import { Schema, model, models } from "mongoose";

const BookingSchema = new Schema({
  image: {
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  unit: {
    type: String,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
});

//indexed fields for searching
BookingSchema.index({
  name: "text",
});

const Booking = models.Booking || model("Booking", BookingSchema);

export default Booking;
