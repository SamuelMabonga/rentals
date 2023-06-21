import bill from "models/bills";
import Tenant from "models/tenant";
import Unit from "models/unit";
import Fuse from "fuse.js";
import Bills from "models/bills";
import moment from "moment";
import PropertyFeatures from "models/propertyFeatures";

// get all bills
export async function fetchAllBills(req: any, res: any) {
  try {
    let bills = await Bills.find().populate({
      path: "tenant",
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
    const { tenantId, rentAmount } = req.body;

    const tenant = await Tenant.findById(tenantId).populate(
      "additionalFeatures"
    );

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const additionalFeatures: any = tenant.additionalFeatures.map(
      (feature: any) => feature._id
    ); // Extract the feature IDs from the populated additionalFeatures array

    const currentDate = new Date();
    const payDate = new Date(tenant?.end_date);

    // Check if the tenant's end_date is past the current date
    if (tenant.end_date < currentDate) {
      
      // Create a rent bill
      const rentBill = new Bills({
        startDate: tenant.start_date,
        endDate: tenant.end_date,
        tenant: tenantId,
        type: "Rent", // Set the bill type as 'Rent'
        propertyFeature: null, // No specific property feature for rent bill, so set it to null
        amount: rentAmount, // TODO  ?? set default rent to unit type rent 
        pay_by: payDate?.setDate(payDate.getDate() + 7),  // set dedault pay date to 7 days 
      });

      await rentBill.save();
    }

    // Iterate through each additional feature ID
    for (const featureId of additionalFeatures) {
      const propertyFeature = await PropertyFeatures.findById(featureId); // Fetch the property feature information based on the ID

      if (!propertyFeature) {
        console.log(`Property feature ID ${featureId} does not exist`);
        // Handle the case when the property feature ID doesn't exist
        continue; // Move to the next iteration
      }

      // Create a new bill for each feature
      const bill = new Bills({
        startDate: tenant.start_date,
        endDate: tenant.end_date,
        tenant: tenantId,
        type: "Feature", // set bill type to 'Feature'
        propertyFeature: featureId,
        amount: propertyFeature.price, // Set the bill amount as the price from the property feature
        pay_by: payDate?.setDate(payDate.getDate() + 7),  // set dedault pay date to 7 days 
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
