import { Schema, model, models } from "mongoose";
import Unit from "./unit";
import User from "./user";
import PropertyFeatures from "./propertyFeatures";
import BillingPeriods from "./billingPeriod";
import Property from "./property";


const BookingSchema = new Schema({
  name: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    index: {
      "name": "text",
    }
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: Unit,
    index: {
      "name": "text",
    }
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: Property,
  },
  additionalFeatures: [
    {
      type: Schema.Types.ObjectId,
      ref: PropertyFeatures,
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
  customRent: {
    type: String
  },
  customBillingPeriod: {
    type: Schema.Types.ObjectId,
    ref: BillingPeriods
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
