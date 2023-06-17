import Ticket from "models/ticket";

// get all Tickets
export async function fetchAllTickets(req: any, res: any) {
  try {
    let ticket = await Ticket.find().populate({ path: "unit" });
    res.status(200).json({
      success: true,
      msg: "tickets fetched successfully",
      data: Ticket,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  tickets",
      data: error,
    });
    console.log(error);
  }
}

// get unit Tickets
export async function fetchUnitTickets(req: any, res: any) {
  let unitId = req.body.unitId;
  try {
    let ticket = await Ticket.find({ unit: unitId }).populate({ path: "unit" });
    res.status(200).json({
      success: true,
      msg: "tickets fetched successfully",
      data: Ticket,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  tickets",
      data: error,
    });
    console.log(error);
  }
}

// create a Ticket
export async function createTicket(req: any, res: any) {
  try {
    const requiredFields = ["name"];

    const includesAllFields = requiredFields.every((field) => {
      return !!req.body[field];
    });
    console.log("required fields is", includesAllFields);

    if (!includesAllFields) {
      return res.status(400).json({
        success: false,
        msg: "Please supply all required fields",
        requiredFields,
      });
    }

    const ticket = new Ticket({
      ...req.body,
    });

    const newTicket = await ticket.save();

    return res.json({
      success: true,
      msg: "New ticket created",
      _id: newTicket?._id,
      unit: newTicket?.unit,
      image: newTicket?.image,
      message: newTicket?.message,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch Ticket by id
export async function fetchSingleTicket(req: any, res: any) {
  try {
    let ticket = await Ticket.findById(req.params.id).populate({
      path: "unit",
    });
    res.status(200).json({
      success: true,
      msg: "ticket fetched successfully",
      data: Ticket,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch ticket",
      data: error,
    });
    console.log(error);
  }
}

//update a Ticket
export async function updateTicket(req: any, res: any) {
  try {
    let ticket = await Ticket.findById(req.params.id);

    const data = {
      unit: req.body.unit || ticket.unit,
      image: req.body.image || ticket.image,
      message: req.body.message || ticket.message,
    };
    ticket = await Ticket.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "ticket updated successfully",
      data: ticket,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update ticket",
      data: error,
    });
  }
}

//delete a Ticket
export async function deleteTicket(req: any, res: any) {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      //   return next("Ticket being deleted has not been found");
      return "ticket being deleted has not been found";
    }

    await Ticket.deleteOne(ticket);

    res.json({
      success: true,
      msg: "ticket deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete ticket",
      data: error,
    });
    console.log(error);
  }
}
