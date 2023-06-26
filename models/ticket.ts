import { Schema, model, models } from "mongoose";

const TicketShema = new Schema({
  image: {
    type: String,
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
  },
  message: {
    type: String,
  },
  created_at: {
    type: Date,
  }
});

const Ticket = models.Ticket || model("Ticket", TicketShema);

export default Ticket;
