import { getPageInfo } from "helpers/page_info";
import Ticket from "models/ticket";

// get all Tickets
export async function fetchAllTickets(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [tickets, ticketsCount] = await Promise.all([
      Ticket.find()
        .populate({ path: "unit" })
        .skip((page - 1) * limit)
        .limit(limit),
      Ticket.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      msg: "tickets fetched successfully",
      data: tickets,
      pageInfo: getPageInfo(limit, ticketsCount, page),
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

// get all Tickets
export async function fetchTicketsByTenant(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [tickets, ticketsCount] = await Promise.all([
      Ticket.find()
        .populate({ path: "unit" })
        .skip((page - 1) * limit)
        .limit(limit),
      Ticket.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      msg: "tickets fetched successfully",
      data: tickets,
      pageInfo: getPageInfo(limit, ticketsCount, page),
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
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [tickets, ticketsCount] = await Promise.all([
      Ticket.find({ unit: unitId })
        .populate({ path: "unit" })
        .skip((page - 1) * limit)
        .limit(limit),
      Ticket.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      msg: "tickets fetched successfully",
      data: tickets,
      pageInfo: getPageInfo(limit, ticketsCount, page),
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
    const ticket = new Ticket({
      ...req.body,
    });

    const newTicket = await ticket.save();

    return res.json({
      success: true,
      msg: "New ticket created",
      data: newTicket,
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
      status: req.body.status || ticket.status,
      tenantSatisfaction:
        req.body.tenantSatisfaction || ticket.tenantSatisfaction,
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
