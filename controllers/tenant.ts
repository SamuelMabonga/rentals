import { getPageInfo } from "helpers/page_info";
import Tenant from "models/tenant";
import UserRoles from "models/userRoles";

// get all tenants
export async function fetchAllTenants(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [tenants, tenantsCount] = await Promise.all([
      Tenant.find()
        .populate("user")
        .populate("unit")
        .skip((page - 1) * limit)
        .limit(limit),
      Tenant.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      msg: "tenants fetched successfully",
      data: tenants,
      pageInfo: getPageInfo(limit, tenantsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  tenants",
      data: error,
    });
    console.log(error);
  }
}

// get user's tenancies
export async function fetchAllUserTenancies(req: any, res: any, id: string) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [tenants, tenantsCount] = await Promise.all([
      Tenant.find({ user: id })
        .populate("user")
        .populate("unit")
        .populate("property")
        .skip((page - 1) * limit)
        .limit(limit),
      Tenant.countDocuments({ user: id }),
    ]);
    return res.status(200).json({
      success: true,
      msg: "User's tenancies fetched successfully",
      data: tenants,
      pageInfo: getPageInfo(limit, tenantsCount, page),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "failed to fetch user's tenancies",
      data: error,
    });
    console.log(error);
  }
}

// get property's tenants
export async function fetchAllPropertyTenants(req: any, res: any) {
  const {
    query: { id, searchQuery },
  }: any = req;
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;

  try {
    const [tenants, tenantsCount] = await Promise.all([
      Tenant.find({ "property": id })
        .populate("user")
        .populate({
          path: "unit",
          })
        .skip((page - 1) * limit)
        .limit(limit),
      Tenant.countDocuments({ "property": id }),
    ]);
    res.status(200).json({
      success: true,
      msg: "Property's tenants fetched successfully",
      data: tenants,
      pageInfo: getPageInfo(limit, tenantsCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch property's tenants",
      data: error,
    });
    console.log(error);
  }
}

// create a tenant
export async function createTenant(req: any, res: any) {
  try {
    // const requiredFields = ["name"];

    // const includesAllFields = requiredFields.every((field) => {
    //   return !!req.body[field];
    // });
    // console.log("required fields is", includesAllFields);

    // if (!includesAllFields) {
    //   return res.status(400).json({
    //     success: false,
    //     msg: "Please supply all required fields",
    //     requiredFields,
    //   });
    // }

    const tenant = new Tenant({
      ...req.body,
      status: "PENDING",
    });

    const newTenant = await tenant.save();

    return res.json({
      success: true,
      msg: "New tenant created",
      data: newTenant,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch tenant by id
export async function fetchSingleTenant(req: any, res: any, user: string) {
  const tenant = req.query.id
  try {
    let tenant = await Tenant.findById(req.query.id)
      .populate("user")
      .populate({ path: "unit", populate: [{ path: "property" }] });
    res.status(200).json({
      success: true,
      msg: "tenant fetched successfully",
      data: tenant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch tenant",
      data: error,
    });
  }
}

//update a tenant
export async function updateTenant(req: any, res: any) {
  try {
    let tenant: any = await Tenant?.findById(req.params.id);

    const data = {
      name: req.body.name || tenant?.name,
      image: req.body.image || tenant.image,
      unit: req.body.unit || tenant.unit,
      entry_date: req.body.entry_date || tenant.entry_date,
      end_date: req.body.end_date || tenant.end_date,
    };
    tenant = await Tenant.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "tenant updated successfully",
      data: tenant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update tenant",
      data: error,
    });
  }
}

//delete a tenant
export async function deleteTenant(req: any, res: any) {
  try {
    let tenant: any = await Tenant.findById(req.params.id);

    if (!tenant) {
      //   return next("tenant being deleted has not been found");
      return "tenant being deleted has not been found";
    }

    await Tenant.deleteOne(tenant);

    res.json({
      success: true,
      msg: "tenant deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete tenant",
      data: error,
    });
    console.log(error);
  }
}
