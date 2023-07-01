import { getPageInfo } from "helpers/page_info";
import Staff from "models/staff";

// get all staffs
export async function fetchAllStaffs(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [staffs, staffsCount] = await Promise.all([
      Staff.find()
        .skip((page - 1) * limit)
        .limit(limit),
      Staff.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      msg: "staffs fetched successfully",
      data: staffs,
      pageInfo: getPageInfo(limit, staffsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  staffs",
      data: error,
    });
    console.log(error);
  }
}

export async function fetchAllStaffsByRoles(req: any, res: any) {
  let roleId = req.query.roleId;
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [staffs, staffsCount] = await Promise.all([
      Staff.find({ role: roleId })
        .skip((page - 1) * limit)
        .limit(limit),
      Staff.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      msg: "staffs fetched successfully",
      data: staffs,
      pageInfo: getPageInfo(limit, staffsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  staffs",
      data: error,
    });
    console.log(error);
  }
}

// create a staff
export async function createStaff(req: any, res: any) {
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

    const staff = new Staff({
      ...req.body,
    });

    const newstaff = await staff.save();

    return res.json({
      success: true,
      msg: "New staff created",
      _id: newstaff?._id,
      name: newstaff?.name,
      image: newstaff?.image,
      role: newstaff?.role,
      start_date: newstaff?.start_date,
      end_date: newstaff?.end_date,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch staff by id
export async function fetchSingleStaff(req: any, res: any) {
  try {
    let staff = await Staff.findById(req.params.id);
    res.status(200).json({
      success: true,
      msg: "staff fetched successfully",
      data: staff,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch staff",
      data: error,
    });
    console.log(error);
  }
}

//update a staff
export async function updateStaff(req: any, res: any) {
  try {
    let staff = await Staff.findById(req.params.id);

    const data = {
      name: req.body.name || staff.name,
      image: req.body.image || staff.image,
      role: req.body.role || staff.role,
      start_date: req.body.start_date || staff.start_date,
      end_date: req.body.end_date || staff.end_date,
    };
    staff = await staff.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "staff updated successfully",
      data: staff,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update staff",
      data: error,
    });
  }
}

//delete a staff
export async function deleteStaff(req: any, res: any) {
  try {
    let staff = await Staff.findById(req.params.id);

    if (!staff) {
      //   return next("staff being deleted has not been found");
      return "staff being deleted has not been found";
    }

    await staff.deleteOne(staff);

    res.json({
      success: true,
      msg: "staff deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete staff",
      data: error,
    });
    console.log(error);
  }
}

// @desc    search
// @route   GET /api/staff?searchQuery=searchQuery
export async function searchStaff(req: any, res: any, searchQuery: string) {
  try {
    let findParams = searchQuery
      ? {
          $text: {
            $search: searchQuery,
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
        }
      : {};

    const staff = await Staff.find({ ...findParams });

    res.status(200).json({
      success: true,
      msg: `${searchQuery} searched successfully`,
      data: staff,
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
