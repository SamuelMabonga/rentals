import { Schema, model, models } from "mongoose";

const TicketShema = new Schema({
  image: {
    type: String,
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: "Unit",
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
    enum: ["FIXED", "INPROGRESS"],
  },
  tenantSatisfaction: {
    type: String,
    enum: ["YES", "NO"],
  },
  created_at: {
    type: Date,
  },
});

const Ticket = models.Ticket || model("Ticket", TicketShema);

export default Ticket;
