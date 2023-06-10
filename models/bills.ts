import { Schema, model, models } from "mongoose";

const BillsShema = new Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
  },
  type: {
    type: String, // Rent / Feature
  },
  propertyFeature: {
    type: Schema.Types.ObjectId,
    ref: 'PropertyFeatures',
  },
  amount: {
    type: String
  }
});

const Bills = models.Bills || model("Bills", BillsShema);

export default Bills;
