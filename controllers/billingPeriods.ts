import { getPageInfo } from "helpers/page_info";
import BillingPeriods from "models/billingPeriod";

// get all Staff Roles
export async function fetchAllBillingPeriods(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {

    const [billingPeriods, billingPeriodsCount] = await Promise.all([
      BillingPeriods.find()
        .skip((page - 1) * limit)
        .limit(limit),
      BillingPeriods.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      msg: "Billing periods fetched successfully",
      data: billingPeriods,
      pageInfo: getPageInfo(limit, billingPeriodsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch Billing periods",
      data: error,
    });
    console.log(error);
  }
}

// create a billing period
export async function createBillingPeriod(req: any, res: any) {
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

    const billingPeriod = new BillingPeriods({
      ...req.body,
    });

    const newBillingPeriod = await billingPeriod.save();

    return res.json({
      success: true,
      msg: "New billing period created",
      _id: newBillingPeriod?._id,
      name: newBillingPeriod?.name,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch staff role by id
export async function fetchSingleBillingPeriod(req: any, res: any) {
  try {
    let billingPeriod = await BillingPeriods.findById(req.params.id);
    res.status(200).json({
      success: true,
      msg: "Billing period fetched successfully",
      data: billingPeriod,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch staff role",
      data: error,
    });
    console.log(error);
  }
}

//update a staff role
export async function updateBillingPeriod(req: any, res: any) {
  try {
    let billingPeriod = await BillingPeriods.findById(req.params.id);

    const data = {
      name: req.body.name || billingPeriod.name,
    };
    billingPeriod = await BillingPeriods.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      msg: "Billing period updated successfully",
      data: billingPeriod,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to update Billing period",
      data: error,
    });
  }
}

//delete a Billing period
export async function deleteBillingPeriod(req: any, res: any) {
  try {
    let billingPeriod = await BillingPeriods.findById(req.params.id);

    if (!billingPeriod) {
      return "Billing period being deleted has not been found";
    }

    await BillingPeriods.deleteOne(billingPeriod);

    res.json({
      success: true,
      msg: "Billing period deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to delete Billing period",
      data: error,
    });
    console.log(error);
  }
}
