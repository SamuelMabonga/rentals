// import bill from "models/bills";
import Tenant from "models/tenant";
import Unit from "models/unit";
import Fuse from "fuse.js";
import Bills from "models/bills";
import moment from "moment";
import PropertyFeatures from "models/propertyFeatures";
import { getPageInfo } from "helpers/page_info";
import billsEmail from "helpers/billsEmail";

// get all bills
export async function fetchAllBills(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [bills, billsCount] = await Promise.all([
      Bills.find()
        .populate({
          path: "tenant",
        })
        .skip((page - 1) * limit)
        .limit(limit),
      Bills.countDocuments(),
    ]);

    res.json({
      success: true,
      msg: "bills fetched successfully",
      data: bills,
      pageInfo: getPageInfo(limit, billsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  bills",
      data: error,
    });
    console.log(error);
  }
}


// get tenant's bills
export async function fetchAllTenantBills(req: any, res: any, userId: string) {
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
    const [bills, billsCount] = await Promise.all([
      Bills.find(queryCondition)
        .populate({
          path: "tenant",
        })
        .populate({
          path: "propertyFeature",
          populate: [{ path: "feature" }],
        })
        .skip((page - 1) * limit)
        .limit(limit),
      Bills.countDocuments(queryCondition),
    ]);

    res.json({
      success: true,
      msg: "Tenant's bills fetched successfully",
      data: bills,
      pageInfo: getPageInfo(limit, billsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch tenant's bills",
      data: error,
    });
    console.log(error);
  }
}

// get property's bills
export async function fetchAllPropertyBills(req: any, res: any) {
  const {
    query: { id, searchQuery, status },
  }: any = req;

  let queryCondition: any = { property: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [bills, billsCount] = await Promise.all([
      Bills.find(queryCondition)
        .populate({
          path: "tenant",
          populate: [{ path: "user" }, { path: "unit" }],
        })
        .populate({
          path: "propertyFeature",
          populate: [{ path: "feature" }],
        })
        .skip((page - 1) * limit)
        .limit(limit),
      Bills.countDocuments(queryCondition),
    ]);

    res.json({
      success: true,
      msg: "Property's bills fetched successfully",
      data: bills,
      pageInfo: getPageInfo(limit, billsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch property's bills",
      data: error,
    });
    console.log(error);
  }
}

// get bills statistics
export async function fetchBillsStatistics(req: any, res: any, userId: string) {
  const {
    query: { id },
  }: any = req;

  try {
    const [paidBills, allBills] = await Promise.all([
      Bills.find({ "property": id, status: "PAID" }),
      Bills.find({ "property": id }),
    ]);

    const totalPaid = paidBills.reduce((acc: any, curr: any) => {
      return acc + curr.amount;
    }, 0);

    const totalBills = allBills.reduce((acc: any, curr: any) => {
      return acc + curr.amount;
    }, 0);


    res.json({
      success: true,
      msg: "Bills statistics fetched successfully",
      data: {
        totalPaid,
        totalBills,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch tenant's bills",
      data: error,
    });
    console.log(error);
  }
}

// create a bill
// used for generating intial bills and called under accept
export async function createBill(
  req: any,
  res: any,
  tenantId: any,
  customRent: any
) {
  try {
    // const { tenantId, customRent } = req.body;/

    const tenant = await Tenant.findById(tenantId)
      .populate({
        path: "additionalFeatures",
        populate: [{ path: "billingPeriod" }],
      })
      .populate({
        path: "unit",
        populate: [{ path: "unitType", populate: [{ path: "billingPeriod" }] }],
      })
      .populate("customBillingPeriod");

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    // const additionalFeatures: any = tenant.additionalFeatures.map(
    //   (feature: any) => feature._id
    // ); // Extract the feature IDs from the populated additionalFeatures array

    const currentDate = new Date();
    const payDate = new Date(tenant?.end_date);

    // Check if the tenant's end_date is past the current date

    // TODO: add try catch
    // Create a rent bill
    try {
      const rentBill = new Bills({
        startDate: tenant?.startDate,
        endDate: tenant?.customBillingPeriod?.time
          ? moment(tenant?.startDate).add(
            tenant?.customBillingPeriod?.time,
            "ms"
          )
          : moment(tenant?.startDate).add(
            tenant?.unit?.unitType?.billingPeriod?.time,
            "ms"
          ),
        tenant: tenantId,
        type: "Rent", // Set the bill type as 'Rent'
        propertyFeature: null, // No specific property feature for rent bill, so set it to null
        amount: customRent ?? tenant?.unit?.unitType?.price,
        pay_by: tenant?.customBillingPeriod?.time
          ? moment(tenant?.start_date).add(
            tenant?.customBillingPeriod?.time + 604800000,
            "ms"
          )
          : moment(tenant?.start_date).add(
            tenant?.unit?.unitType?.billingPeriod?.time + 604800000,
            "ms"
          ), // set dedault pay date to 7 days
      });

      await rentBill.save();
    } catch (error) {
      console.log("BILLING ERROR MESSAGE", error);
    }

    // Iterate through each additional feature ID
    for (const feature of tenant?.additionalFeatures) {
      // const propertyFeature = await PropertyFeatures.findById(featureId); // Fetch the property feature information based on the ID

      // Create a new bill for each feature
      const bill = new Bills({
        startDate: tenant?.startDate,
        endDate: moment(tenant?.startDate).add(
          tenant?.unit?.unitType?.billingPeriod?.time,
          "ms"
        ),
        tenant: tenantId,
        type: "Feature", // set bill type to 'Feature'
        propertyFeature: feature?._id,
        amount: feature?.price, // Set the bill amount as the price from the property feature
        pay_by: tenant?.customBillingPeriod?.time
          ? moment(tenant?.startDate).add(
            tenant?.customBillingPeriod?.time + 604800000,
            "ms"
          )
          : moment(tenant?.startDate).add(
            tenant?.unit?.unitType?.billingPeriod?.time + 604800000,
            "ms"
          ), // set dedault pay date to 7 days
      });

      await bill.save();
    }

    // Return a success response
    res.status(200).json({ message: "Bills created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

// cron bills
// create a bill
export async function createCronBills(req: any, res: any) {
  try {
    let tenants = await Tenant.find({ status: "ACTIVE" })
      .populate("user")
      .populate("customBillingPeriod")
      .populate({
        path: "additionalFeatures",
        populate: [{ path: "billingPeriod" }],
      })
      .populate({
        path: "unit",
        populate: [{ path: "unitType", populate: [{ path: "billingPeriod" }] }],
      });


    for (const tenant of tenants) {
      const {
        _id,
        customRent,
        additionalFeatures,
        unit,
        customBillingPeriod,
        endDate,
        startDate,
        property
      } = tenant;

      // Array to store created bills for the tenant
      const createdBills = [];

      try {
        let latestRent: any[] = await Bills.find({ tenant: _id.toString(), type: "RENT" })
          .sort({ createdAt: -1 })
          .limit(1);

        console.log("LATEST RENT", latestRent)
        console.log("MOMENT", moment().isBefore(latestRent[0]?.endDate))

        if (latestRent && moment().isAfter(latestRent[0]?.endDate)) {
          console.log("LATEST RENT", latestRent)

          const newRent = new Bills({
            amount: !customRent ? unit.unitType.price : customRent,
            startDate: latestRent[0]?.endDate,
            endDate: !customBillingPeriod
              ? moment().add(1, unit?.unitType?.billingPeriod?.period)
              : moment().add(1, customBillingPeriod?.period),
            pay_by: !customBillingPeriod
              ? moment().add(1, unit?.unitType?.billingPeriod?.period).add(7, "days")
              : moment().add(1, customBillingPeriod?.period).add(7, "days"),
            tenant: _id,
            type: "RENT",
            property
          });

          console.log("NEW RENT", newRent)
          await newRent.save();

          createdBills.push(newRent);
        }
        // }
      } catch (error) {
        console.log("Failed to create rent bill for tenant:", _id);
        console.log(error);
      }

      for (const feature of additionalFeatures) {
        try {
          let latestBill: any[] = await Bills.find({
            tenant: _id,
            type: "FEATURE",
            propertyFeature: feature._id,
          })
            .sort({ createdAt: -1 })
            .limit(1);

          if (latestBill && moment().isAfter(latestBill[0]?.endDate)) {
            let newBill = new Bills({
              amount: feature.price,
              startDate: latestBill[0]?.endDate,
              endDate: moment().add(1, feature?.billingPeriod?.period),
              pay_by: moment().add(1, feature?.billingPeriod?.period).add(7, "days"),
              tenant: _id,
              type: "FEATURE",
              propertyFeature: feature._id,
              property
            });

            await newBill.save();
            // console.log("NEW BILL", newBill)
            createdBills.push(newBill);
          }

        } catch (error) {
          console.log("Failed to create bill for feature:", feature._id);
          console.log(error);
        }
      }

      // Send email to tenant
      if (createdBills.length > 0) {
        await billsEmail(tenant, createdBills, res);
      }
    }

    // Return a success response
    res.status(200).json({ message: "Bills created successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
      error,
    });
  }
}


//fetch bill by id
export async function fetchSinglebill(req: any, res: any) {
  try {
    let bill = await Bills.findById(req.query.id)
      .populate({
        path: "tenant",
      })
      .populate({
        path: "additionalFeatures",
        populate: [{ path: "feature" }],
      });

    res.json({
      success: true,
      msg: "bills fetched successfully",
      data: bill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch bill",
      data: error,
    });
    console.log(error);
  }
}

//update a bill
export async function updatebill(req: any, res: any) {
  try {
    let bill = await Bills.findById(req.query.id);

    const data = {
      ...req.body,
    };
    bill = await bill
      .findByIdAndUpdate(req.query.id, data, {
        new: true,
      })
      .populate({
        path: "tenant",
      });

    res.status(200).json({
      success: true,
      msg: "bill updated successfully",
      data: bill,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      msg: "failed to update bill",
      data: error,
    });
  }
}

//delete a bill
export async function deletebill(req: any, res: any) {
  try {
    let bill = await Bills.findById(req.query.id);

    if (!bill) {
      //   return next("bill being deleted has not been found");
      return "bill being deleted has not been found";
    }

    await bill.deleteOne(bill);

    res.json({
      success: true,
      msg: "bill deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete bill",
      data: error,
    });
    console.log(error);
  }
}

// @desc    search
// @route   GET /api/bill?searchQuery=searchQuery
export async function searchBill(req: any, res: any) {
  const {
    query: { id, searchQuery, status },
  }: any = req;

  let queryCondition: any = { tenant: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  try {
    let bills = await Bills.find(queryCondition)
      .populate({path: "propertyFeature", populate: {path: "feature"}})
      .populate({
        path: "tenant",
      });


    const options = {
      keys: ["startDate", "endDate", "propertyFeature.feature.name", "type"],
      threshold: 0.3,
    };

    if (searchQuery?.replace(/%/g, "")) {
      const formatText = searchQuery?.replace(/%/g, "");
      const fuse = new Fuse(bills, options);
      bills = fuse.search(formatText)?.map(({ item }) => item);
    }

    res.status(200).json({
      success: true,
      msg: `${searchQuery} searched successfully`,
      data: bills,
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

// @desc    search
// @route   GET /api/bill?searchQuery=searchQuery
export async function searchPropertyBills(req: any, res: any) {
  const {
    query: { id, searchQuery, status },
  }: any = req;

  let queryCondition: any = { property: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  try {
    let bills = await Bills.find(queryCondition)
      .populate({path: "propertyFeature", populate: {path: "feature"}})
      .populate({
        path: "tenant",
        populate: [{ path: "user" }, { path: "unit" }],
      });


    const options = {
      keys: ["startDate", "endDate", "propertyFeature.feature.name", "type", "tenant.user.name", "tenant.unit.name"],
      threshold: 0.3,
    };

    if (searchQuery?.replace(/%/g, "")) {
      const formatText = searchQuery?.replace(/%/g, "");
      const fuse = new Fuse(bills, options);
      bills = fuse.search(formatText)?.map(({ item }) => item);
    }

    res.status(200).json({
      success: true,
      msg: `${searchQuery} searched successfully`,
      data: bills,
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


// Tenant bills statistics
export async function tenantBillsStatistics(req: any, res: any) {
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
      bills,
      billsPaid,
      billsPending,
      billsOverdue
    ] = await Promise.all([
      Bills.find({ tenant: id }),
      Bills.find({ tenant: id, status: "PAID" }),
      Bills.find({ tenant: id, status: "PENDING" }),
      Bills.find({ tenant: id, status: "OVERDUE" }),
    ])

    const totalAmount = bills.reduce((acc: any, curr: any) => {
      return acc + curr.amount;
    }, 0);
    const totalPaid = billsPaid.reduce((acc: any, curr: any) => {
      return acc + curr.amount;
    }, 0);
    const totalPending = billsPending.reduce((acc: any, curr: any) => {
      return acc + curr.amount;
    }, 0);
    const totalOverdue = billsOverdue.reduce((acc: any, curr: any) => {
      return acc + curr.amount;
    }, 0);

    res.json({
      success: true,
      msg: "Bills statistics fetched successfully",
      data: {
        totalAmount,
        totalPaid,
        totalPending,
        totalOverdue
      }
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch bills statistics",
      data: error,
    });
  }
}

