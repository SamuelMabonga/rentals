import bill from "models/bills";
import Tenant from "models/tenant";
import Unit from "models/unit";
import Fuse from "fuse.js";
import Bills from "models/bills";
import moment from "moment";

// get all bills
export async function fetchAllBills(req: any, res: any) {
  try {
    let bills = await Bills.find()
      .populate({
        path: "tenant",
      })
      .populate({
        path: "propertyFeatures",
      });

    res.json({
      success: true,
      msg: "bills fetched successfully",
      data: bills,
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

// create a bill
export async function createBill(req: any, res: any) {
  try {
    let tenantId = req.body.tenantId;

    let tenant = await Tenant.findById(tenantId)
      .populate("user")
      .populate({ path: "unit", populate: [{ path: "property" }] });

    const { _id, end_date, start_date, customRent, additionalFeatures } =
      tenant && tenant;
    let endDate = tenant && tenant?.end_date;
    let currentDate = moment();
    let bill;
    let newBill;

    if (moment(endDate).isAfter(currentDate)) {
      bill = new Bills({
        amount: customRent,
        startDate: start_date,
        endDate: end_date,
        tenant: _id,
        type: "rent",
        propertyFeature: additionalFeatures,
      });
      newBill = await bill.save();
      console.log("newBill", newBill);
      return res.json({
        success: true,
        msg: "New bill created",
        data: newBill,
      });
    }else{
      return res.json({
        success: true,
        msg: "No overdue bills",
        data: newBill,
      });
    }
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
export async function searchBill(req: any, res: any, searchQuery: string) {
  try {
    let bills = await bill.find().populate({
      path: "tenat",
    });

    const options = {
      keys: ["startDate", "endDate"],
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
      msg: `failed to search ${searchQuery}`,
      data: error,
    });
    console.log(error);
  }
}
