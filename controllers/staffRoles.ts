import StaffRoles from "models/staffRoles";

// get all Staff Roles
export async function fetchAllStaffRoles(req: any, res: any) {
  try {
    let staffRole = await StaffRoles.find();
    res.status(200).json({
      success: true,
      msg: "Staff Roles fetched successfully",
      data: staffRole,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch Staff Roles",
      data: error,
    });
    console.log(error);
  }
}

// create a staff Role
export async function createStaffRole(req: any, res: any) {
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

    const staffRole = new StaffRoles({
      ...req.body,
    });

    const newStaffRole = await staffRole.save();

    return res.json({
      success: true,
      msg: "New staff role created",
      _id: newStaffRole?._id,
      name: newStaffRole?.name,
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
export async function fetchSingleStaffRole(req: any, res: any) {
  try {
    let staffRole = await StaffRoles.findById(req.params.id);
    res.status(200).json({
      success: true,
      msg: "Staff role fetched successfully",
      data: staffRole,
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
export async function updateStaffRole(req: any, res: any) {
  try {
    let staffRole = await StaffRoles.findById(req.params.id);

    const data = {
      name: req.body.name || staffRole.name,
    };
    staffRole = await StaffRoles.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "Staff role updated successfully",
      data: staffRole,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update staff role",
      data: error,
    });
  }
}

//delete a staffRole
export async function deleteStaffRole(req: any, res: any) {
  try {
    let staffRole = await StaffRoles.findById(req.params.id);

    if (!staffRole) {

      return "Staff role being deleted has not been found";
    }

    await StaffRoles.deleteOne(staffRole);

    res.json({
      success: true,
      msg: "Staff role deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to delete staff role",
      data: error,
    });
    console.log(error);
  }
}
