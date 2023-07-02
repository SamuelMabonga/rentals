import { Schema, model, models } from "mongoose";
import Tenant from "./tenant";
import Unit from "./unit";

const TicketShema = new Schema({
  image: {
    type: String,
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: Tenant,
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: Unit,
  },
  message: {
    type: String,
  },
  type: {
    type: String,
    enum: [
      "MAINTENANCE AND REPAIR",
      "SAFETY CONCERNS",
      "NOISE COMPLAINTS",
      "PEST INFECTION",
      "RENTAL PAYMENT ISSUES",
      "DISPUTES WITH LANDLORDS",
      "PRIVACY VIOLATIONS",
      "HEALTH AND SANITATION ISSUES",
      "ACCESSIBILITY ISSUES",
      "UNRESPONSIVE LANDLORDS",
    ],
  },
  status: {
    type: String,
    enum: ["FIXED", "INPROGRESS", "PENDING"],
    default: "PENDING",
  },
  tenantSatisfaction: {
    type: String,
    enum: ["YES", "NO"],
  },
}, {
  timestamps: true,
});

const Ticket = models.Ticket || model("Ticket", TicketShema);

export default Ticket;
