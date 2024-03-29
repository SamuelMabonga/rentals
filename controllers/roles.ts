import bill from "models/bills";
import Fuse from "fuse.js";
import Bills from "models/bills";
import moment from "moment";
import { getPageInfo } from "helpers/page_info";
import Roles from "models/roles";

// get all roles
export async function fetchAllRoles(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [roles, rolesCount] = await Promise.all([
      Roles.find()
        .skip((page - 1) * limit)
        .limit(limit),
      Roles.countDocuments(),
    ]);

    res.json({
      success: true,
      msg: "Roles fetched successfully",
      data: roles,
      pageInfo: getPageInfo(limit, rolesCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch roles",
      data: error,
    });
    console.log(error);
  }
}

//fetch bill by id
export async function fetchSingleRole(req: any, res: any) {
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


// create a role
export async function createRole(req: any, res: any) {
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
  
      const feature = new Roles({
        ...req.body,
      });
  
      const newRole = await feature.save();
  
      return res.json({
        success: true,
        msg: "Role created successfully",
        data: newRole
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
        success: false,
      });
    }
  }

//update a bill
export async function updateRole(req: any, res: any) {
  try {
    let role = await Roles.findById(req.query.id);

    const data = {
      ...req.body,
    };
    role = await Roles
      .findByIdAndUpdate(req.query.id, data, {
        new: true,
      })
      
    res.status(200).json({
      success: true,
      msg: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      msg: "Failed to update role",
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
