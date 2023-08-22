import { getPageInfo } from "helpers/page_info";
import Ticket from "models/ticket";
import Fuse from "fuse.js";

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
export async function fetchTicketsByTenant(req: any, res: any, userId: string) {
  const {
    query: { id, searchQuery, status },
  }: any = req;

  let queryCondition: any = { tenant: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [tickets, ticketsCount] = await Promise.all([
      Ticket.find(queryCondition)
        .populate({ path: "unit" })
        .populate({ path: "tenant" })
        .skip((page - 1) * limit)
        .limit(limit),
      Ticket.countDocuments(queryCondition),
    ]);

    // if (tickets[0].tenant.user != userId) {
    //   return res.status(403).json({
    //     success: false,
    //     msg: "You are not authorized to view this tenant's tickets",
    //   });
    // }

    res.status(200).json({
      success: true,
      msg: "Tickets fetched successfully",
      data: tickets,
      pageInfo: getPageInfo(limit, ticketsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch  tickets",
      data: error,
    });
    console.log(error);
  }
}

// Get all tickets for a property
export async function fetchTicketsByProperty(req: any, res: any) {
  const {
    id, status
  } = req.query

  let queryCondition: any = { property: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [tickets, ticketsCount] = await Promise.all([
      Ticket.find(queryCondition)
        .populate({ path: "unit" })
        .populate({ path: "tenant", populate: { path: "user" } })
        .skip((page - 1) * limit)
        .limit(limit),
      Ticket.countDocuments(queryCondition),
    ]);

    res.status(200).json({
      success: true,
      msg: "Tickets fetched successfully",
      data: tickets,
      pageInfo: getPageInfo(limit, ticketsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch  tickets",
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

// Search tenant tickets
export async function searchTenantTickets(req: any, res: any) {
  const {
    id, status, searchQuery
  } = req.query

  let queryCondition: any = { tenant: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  try {
    let tickets = await Ticket.find(queryCondition)
      .populate({path: "tenant", populate: {path: "user"}})
      .populate({path: "unit", populate: {path: "property"}})
    const options = {
      keys: ["type"],
      threshold: 0.3,
    };

    if (searchQuery?.replace(/%/g, "")) {
      const formatText = searchQuery?.replace(/%/g, "");
      const fuse = new Fuse(tickets, options);
      tickets = fuse.search(formatText)?.map(({ item }: any) => item);
    }

    res.status(200).json({
      success: true,
      msg: `${searchQuery} searched successfully`,
      data: tickets,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: `Failed to search ${searchQuery}`,
      data: error,
    });
    console.log(error);
  }
}


// Search property tickets
export async function searchPropertyTickets(req: any, res: any) {
  const {
    id, status, searchQuery
  } = req.query

  let queryCondition: any = { property: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  try {
    let tickets = await Ticket.find(queryCondition)
      .populate({path: "tenant", populate: {path: "user"}})
      .populate({path: "unit", populate: {path: "property"}})
    const options = {
      keys: ["user.name", "user.email", "unit.name"],
      threshold: 0.3,
    };

    if (searchQuery?.replace(/%/g, "")) {
      const formatText = searchQuery?.replace(/%/g, "");
      const fuse = new Fuse(tickets, options);
      tickets = fuse.search(formatText)?.map(({ item }: any) => item);
    }

    res.status(200).json({
      success: true,
      msg: `${searchQuery} searched successfully`,
      data: tickets,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: `Failed to search ${searchQuery}`,
      data: error,
    });
    console.log(error);
  }
}


//mark progress
export async function ticketInProgress(req: any, res: any) {
  try {
    let ticket = await Ticket.findById(req.body.ticket);

    const data = {
      ...ticket._doc,
      status: "INPROGRESS",
    };

    ticket = await Ticket.findByIdAndUpdate(req.body.ticket, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "Ticket moved to in progress successfully",
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


//mark completed
export async function ticketCompleted(req: any, res: any) {
  try {
    let ticket = await Ticket.findById(req.body.ticket);

    const data = {
      ...ticket._doc,
      status: "FIXED",
    };

    ticket = await Ticket.findByIdAndUpdate(req.body.ticket, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "Ticket moved to fixed successfully",
      data: ticket,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to update ticket",
      data: error,
    });
  }
}

// Ticket statistics
export async function ticketStatistics(req: any, res: any) {
  const {
    query: { id },
  }: any = req;

  if (!id) {
    return res.status(400).json({
      success: false,
      msg: "No property provided",
    });
  }

  try {
    const [
      totalTickets,
      totalTicketsInProgress,
      totalTicketsFixed,
      totalTicketsPending,
    ] = await Promise.all([
      Ticket.countDocuments({ property: id }),
      Ticket.countDocuments({ property: id, status: "INPROGRESS" }),
      Ticket.countDocuments({ property: id, status: "FIXED" }),
      Ticket.countDocuments({ property: id, status: "PENDING" }),
    ])

    res.json({
      success: true,
      msg: "Ticket statistics fetched successfully",
      data: {
        totalTickets,
        totalTicketsInProgress,
        totalTicketsFixed,
        totalTicketsPending,
      }
    })
    
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch ticket statistics",
      data: error,
    }); 
  }
}

