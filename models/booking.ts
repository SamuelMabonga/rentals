import { Schema, model, models } from "mongoose";

const BookingShema = new Schema({
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
  }
});

const Booking = models.Booking || model("Booking", BookingShema);

export default Booking;
