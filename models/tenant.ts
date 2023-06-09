import { Schema, model, models } from "mongoose";

const TenantShema = new Schema({
  image: {
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: "Unit"
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  }
});

const Tenant = models.Tenant || model("Tenant", TenantShema);

export default Tenant;
