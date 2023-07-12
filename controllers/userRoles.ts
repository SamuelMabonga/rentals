import bill from "models/bills";
import Fuse from "fuse.js";
import Bills from "models/bills";
import moment from "moment";
import { getPageInfo } from "helpers/page_info";
import Roles from "models/roles";
import UserRoles from "models/userRoles";

// get all roles
export async function fetchAllUserRoles(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [userRoles, userRolesCount] = await Promise.all([
      UserRoles.find()
        .skip((page - 1) * limit)
        .limit(limit),
      UserRoles.countDocuments(),
    ]);

    res.json({
      success: true,
      msg: "User roles fetched successfully",
      data: userRoles,
      pageInfo: getPageInfo(limit, userRolesCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch user roles",
      data: error,
    });
    console.log(error);
  }
}

//fetch bill by id
export async function fetchSingleUserRole(req: any, res: any) {
  try {
    let userRole = await UserRoles.findById(req.query.id)
      .populate({
        path: "user",
      })
      .populate({
        path: "property",
      })
      .populate("role");

    res.json({
      success: true,
      msg: "User role fetched successfully",
      data: userRole,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch user role",
      data: error,
    });
    console.log(error);
  }
}


// create a role
export async function createUserRole(req: any, res: any) {
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
  
      const userRole = new UserRoles({
        ...req.body,
      });
  
      const newUserRole = await userRole.save();
  
      return res.json({
        success: true,
        msg: "User role created successfully",
        data: newUserRole
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
        success: false,
      });
    }
  }

//update a user role
export async function updateUserRole(req: any, res: any) {
  try {
    let userRole = await UserRoles.findById(req.query.id);

    const data = {
      ...req.body,
    };
    userRole = await UserRoles
      .findByIdAndUpdate(req.query.id, data, {
        new: true,
      })
      
    res.status(200).json({
      success: true,
      msg: "User role updated successfully",
      data: userRole,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      msg: "Failed to update user role",
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
