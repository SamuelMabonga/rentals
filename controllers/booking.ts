import Booking from "models/booking";
import Tenant from "models/tenant";
import Unit from "models/unit";
import Fuse from "fuse.js";
import { createBill } from "./bills";
import Bills from "models/bills";
import moment from "moment";
import { getPageInfo } from "helpers/page_info";
import Roles from "models/roles";
import UserRoles from "models/userRoles";
import newTenantEmail from "helpers/newTenantEmail";

// get all bookings
export async function fetchAllBookings(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [bookings, bookingsCount] = await Promise.all([
      Booking.find()
        .populate({
          path: "unit",
          populate: [{ path: "unitType" }],
        })
        .populate({
          path: "user",
        })
        .populate({
          path: "additionalFeatures",
          populate: [{ path: "feature" }],
        })
        .skip((page - 1) * limit)
        .limit(limit),
      Booking.countDocuments(),
    ]);
    res.json({
      success: true,
      msg: "bookings fetched successfully",
      data: bookings,
      pageInfo: getPageInfo(limit, bookingsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  bookings",
      data: error,
    });
    console.log(error);
  }
}

// get all Property Bookings
export async function fetchAllPropertyBookings(req: any, res: any) {
  const {
    query: { id, searchQuery, status },
  }: any = req;

  let queryCondition: any = { property: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    console.log("status is", status);
    queryCondition.status = status;
  }

  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [bookings, bookingsCount] = await Promise.all([
      Booking.find(queryCondition)
        .populate({
          path: "unit",
          populate: [{ path: "unitType" }],
        })
        .populate({
          path: "user",
        })
        .populate({
          path: "additionalFeatures",
          populate: [{ path: "feature" }],
        })
        .skip((page - 1) * limit)
        .limit(limit),
      Booking.countDocuments(queryCondition),
    ]);

    res.json({
      success: true,
      msg: "bookings fetched successfully",
      data: bookings,
      pageInfo: getPageInfo(limit, bookingsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  bookings",
      data: error,
    });
    console.log(error);
  }
}

// create a booking
export async function createBooking(req: any, res: any) {
  try {
    const requiredFields = ["user"];

    const includesAllFields = requiredFields.every((field) => {
      return !!req.body[field];
    });
    console.log("required fields is", includesAllFields);

    // FIND UNIT BEING BOOKED
    console.log("UNIT ID IS", req.body.unit)
    const unit: any = await Unit.findById(req.body.unit);

    console.log("UNIT ===>", unit)

    if (!unit) {
      return res.status(404).json({
        success: false,
        msg: "Unit to book not found",
      });
    }

    if (moment(unit.availableAfter).isAfter(req.body.startDate)) {
      return res.status(400).json({
        success: false,
        msg: `Unit is not available before ${moment(unit.availableAfter).format("DD/MM/YYYY")}`,
      });
    }

    if (!includesAllFields) {
      return res.status(400).json({
        success: false,
        msg: "Please supply all required fields",
        requiredFields,
      });
    }

    const booking = new Booking({
      ...req.body,
      status: "PENDING",
    });

    const newBooking = await booking.save();

    return res.json({
      success: true,
      msg: "New booking created",
      _id: newBooking?._id,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch booking by id
export async function fetchSingleBooking(req: any, res: any) {
  try {
    let booking = await Booking.findById(req.query.id)
      .populate({
        path: "unit",
        populate: [{ path: "unitType" }],
      })
      .populate({
        path: "user",
      })
      .populate({
        path: "additionalFeatures",
        populate: [{ path: "feature" }],
      });

    res.json({
      success: true,
      msg: "booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch booking",
      data: error,
    });
    console.log(error);
  }
}

//update a booking
export async function updateBooking(req: any, res: any) {
  try {
    let booking = await Booking.findById(req.query.id);

    const data = {
      ...req.body,
    };
    booking = await Booking.findByIdAndUpdate(req.query.id, data, {
      new: true,
    })
      .populate({
        path: "unit",
        populate: [{ path: "unitType" }],
      })
      .populate({
        path: "user",
      })
      .populate({
        path: "additionalFeatures",
        populate: [{ path: "feature" }],
      });

    res.status(200).json({
      success: true,
      msg: "booking updated successfully",
      data: booking,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      msg: "failed to update booking",
      data: error,
    });
  }
}

//delete a booking
export async function deleteBooking(req: any, res: any) {
  try {
    let booking = await Booking.findById(req.query.id);

    if (!booking) {
      //   return next("booking being deleted has not been found");
      return "booking being deleted has not been found";
    }

    await Booking.deleteOne(booking);

    res.json({
      success: true,
      msg: "booking deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete booking",
      data: error,
    });
    console.log(error);
  }
}

// @desc    search
// @route   GET /api/booking?searchQuery=searchQuery
export async function searchBooking(req: any, res: any, searchQuery: string) {
  // const property = req.query?.id

  const {
    id, status
  } = req.query

  let queryCondition: any = { property: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    console.log("status is", status);
    queryCondition.status = status;
  }

  try {
    let bookings = await Booking.find(queryCondition)
      .populate({
        path: "unit",
        populate: [{ path: "unitType" }],
      })
      .populate({
        path: "user",
      })
      .populate({
        path: "additionalFeatures",
        populate: [{ path: "feature" }],
      });

    const options = {
      keys: ["user.name", "user.email", "unit.name"],
      threshold: 0.3,
    };

    if (searchQuery?.replace(/%/g, "")) {
      const formatText = searchQuery?.replace(/%/g, "");
      const fuse = new Fuse(bookings, options);
      bookings = fuse.search(formatText)?.map(({ item }) => item);
    }

    res.status(200).json({
      success: true,
      msg: `${searchQuery} searched successfully`,
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: `failed to search ${searchQuery}`,
      data: error,
    });
    console.log(error);
  }
}

//accept a booking
export async function acceptBooking(req: any, res: any) {
  const { id } = req.body;
  let additionalFeatures: any = [];

  function PopulateAdditionalFeatures(booking: any) {
    booking?.additionalFeatures.forEach((additionalFeature: any) => {
      additionalFeatures.push(additionalFeature);
    });
    return additionalFeatures;
  }

  // console.log("BOOKING TO ACCEPT IS", id);
  try {
    //UPDATE booking status to accepted
    let booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "ACCEPTED",
      },
      {
        new: true,
      }
    )
      .populate({
        path: "unit",
        populate: [{ path: "unitType", populate: [{ path: "billingPeriod" }] }],
      })
      .populate({
        path: "user",
      })
      .populate({
        path: "additionalFeatures",
        populate: [{ path: "feature" }],
      });

    let BOOKED_UNIT_STATUS = "ACCEPTED";
    if (booking && booking?.unit?.status === BOOKED_UNIT_STATUS) {
      res.status(403).json({
        success: false,
        msg: `booking cannot be made. Unit is ${BOOKED_UNIT_STATUS}`,
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: "Booking not found",
      });
    }

    try {
      //CREATE a new tenant
      const tenantObj = new Tenant({
        user: booking?.user?._id,
        unit: booking?.unit?._id,
        startDate: booking?.startDate,
        endDate: booking?.endDate,
        additionalFeatures: PopulateAdditionalFeatures(booking),
        customRent: booking?.customRent ?? null,
        customBillingPeriod: booking?.customBillingPeriod,
        nextRentBilling: Date.now(),
        status: "PENDING",
        property: booking?.unit?.property,
      });

      const newTenant = await tenantObj.save();

      //genrate bills
      // Create bill
      if (!newTenant._id) {
        return res.status(404).json({ error: "Tenant not created" });
      }

      // Create a rent bill
      try {
        const tenant = await Tenant.findById(newTenant._id)
          .populate({
            path: "additionalFeatures",
            populate: [{ path: "billingPeriod" }],
          })
          .populate({
            path: "unit",
            populate: [
              {
                path: "unitType",
                populate: [{ path: "billingPeriod" }],
              },
            ],
          })
          .populate("customBillingPeriod");

        const rentBill = new Bills({
          startDate: tenant.startDate,
          endDate: tenant?.customBillingPeriod?.period
            ? moment(tenant?.startDate).add(
              1,
              tenant?.customBillingPeriod?.period
            )
            : moment(tenant?.startDate).add(
              1,
              tenant?.unit?.unitType?.billingPeriod?.period
            ),
          tenant: tenant._id,
          type: "RENT", // Set the bill type as 'Rent'
          propertyFeature: null, // No specific property feature for rent bill, so set it to null
          amount: tenant?.unit?.unitType?.price,
          pay_by: tenant?.customBillingPeriod?.period
            ? moment(tenant?.startDate).add(
              1,
              tenant?.customBillingPeriod?.period
            ).add(7, "days")
            : moment(tenant?.startDate).add(
              1,
              tenant?.unit?.unitType?.billingPeriod?.period
            ).add(7, "days"), // set dedault pay date to 7 days,
          property: booking?.unit?.property,
        });

        await rentBill.save();

        // Iterate through each additional feature ID
        for (const feature of tenant?.additionalFeatures) {
          // Create a new bill for each feature
          const bill = new Bills({
            startDate: tenant.startDate,
            endDate: moment(tenant?.startDate).add(
              1,
              feature?.billingPeriod?.period
            ),
            tenant: tenant._id,
            type: "FEATURE", // set bill type to 'Feature'
            propertyFeature: feature?._id,
            amount: feature?.price, // Set the bill amount as the price from the property feature
            pay_by: tenant?.customBillingPeriod?.period
              ? moment(tenant?.startDate).add(
                1,
                feature?.billingPeriod?.period
              ).add(7, "days")
              : moment(tenant?.startDate).add(
                1,
                feature?.billingPeriod?.period
              ).add(7, "days"), // set dedault pay date to 7 days
            property: booking?.unit?.property,
          });

          await bill.save();
        }
      } catch (error) {
        console.log("CREATE RENT ERROR", error);
        return res.status(400).json({ error: "Failed to create rent bill" });
      }


      // UPDATE UNIT STATUS
      try {
        await Unit.findByIdAndUpdate(
          booking?.unit?._id,
          {
            status: "OCCUPIED",
            availableAfter: newTenant?.endDate,
          },
          {
            new: true,
          }
        );
      } catch (error) {
        console.log("UPDATE UNIT STATUS ERROR", error);
        return res.status(400).json({ error: "Failed to update unit status" });
      }

      // find tenant role
      const role = await Roles.findOne({ name: "Tenant" });

      // Create tenant role
      try {
        const tenantRole = new UserRoles({
          user: booking?.user?._id,
          role: role?._id,
          property: booking?.unit?.property,
          tenant: newTenant._id,
        })

        await tenantRole.save();
      } catch (error) {
        console.log("CREATE TENANT ROLE ERROR", error);
        return res.status(400).json({ error: "Failed to create tenant role" });
      }


      // Send email to tenant
      try {
        await newTenantEmail(booking, res)
      } catch (error) {
        console.log("SEND EMAIL ERROR", error);
        return res.status(400).json({ error: "Failed to send email" });
      }

      // Return a success response
      res.status(200).json({ success: true, message: "Booking accepted successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Failed to create bills" });
    }

    res.status(200).json({
      success: true,
      msg: "booking successfully accepted",
      data: booking,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      msg: "failed to update booking",
      data: error,
    });
  }
}

// REJECT BOOKING
export async function rejectBooking(req: any, res: any) {
  const { id } = req.body;

  try {
    //UPDATE booking status to accepted
    let booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "REJECTED",
      },
      {
        new: true,
      }
    )

    res.status(200).json({
      success: true,
      msg: "Booking rejected successfully",
      data: booking,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      msg: "Failed to reject booking",
      data: error,
    });
  }
}


// Booking statistics
export async function bookingStatistics(req: any, res: any) {
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
      totalBookings,
      totalBookingsPending,
      totalBookingsAccepted,
      totalBookingsRejected,
    ] = await Promise.all([
      Booking.countDocuments({ property: id }),
      Booking.countDocuments({ property: id, status: "PENDING" }),
      Booking.countDocuments({ property: id, status: "ACCEPTED" }),
      Booking.countDocuments({ property: id, status: "REJECTED" }),
    ])

    res.json({
      success: true,
      msg: "Ticket statistics fetched successfully",
      data: {
        totalBookings,
        totalBookingsPending,
        totalBookingsAccepted,
        totalBookingsRejected,
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


