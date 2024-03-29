import { getPageInfo } from "helpers/page_info";
import Property from "models/property";
import Roles from "models/roles";
import UserRoles from "models/userRoles";

//@AUTH
// @desc    get all properties
// @route   GET /api/property/user
export async function fetchOwnerProperties(req: any, res: any, owner: string) {
  // let ownerId = req.query.ownerId;
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [properties, propertiesCount] = await Promise.all([
      Property.find({ owner: `${owner}` })
        .skip((page - 1) * limit)
        .limit(limit),
      Property.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      msg: "Properties fetched successfully",
      data: properties,
      pageInfo: getPageInfo(limit, propertiesCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch properties",
      data: error,
    });
    console.log(error);
  }
}

//@AUTH
// @desc    create a property
// @route   GET /api/property/user
export async function createProperty(req: any, res: any) {
  try {
    const { name, description } = req.body;
    console.log("It does not fail after line 30");
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

    const property = new Property({
      ...req.body,
    });

    const newProperty = await property.save();

    // Find owner role
    const role = await Roles.findOne({ name: "Owner" });

    console.log("ROLE", role);
    console.log("NEW PROPERTY", newProperty);

    // Create an owner user role for the property owner
    const ownerRole = new UserRoles({
      property: newProperty._id,
      role: role._id,
      user: req.body.owner,
    });

    // console.log("OWNER ROLE", ownerRole)

    await ownerRole.save();

    return res.json({
      success: true,
      msg: "New property created",
      data: newProperty,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//@AUTH
// @desc    update a property
// @route   GET /api/property/user/:id
export async function updateProperty(req: any, res: any) {
  try {
    let property = await Property.findById(req.query.id);

    const data = {
      name: req.body.name || property.name,
    };
    property = await Property.findByIdAndUpdate(req.query.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "property updated successfully",
      data: property,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update property",
      data: error,
    });
  }
}

//@AUTH
// @desc    delete a property
// @route   GET /api/property/user/:id
export async function deleteProperty(req: any, res: any) {
  try {
    let property = await Property.findById(req.query.id);

    if (!property) {
      // return next("property being deleted has not been found");
      return "property being deleted has not been found";
    }

    await Property.deleteOne(property);

    res.json({
      success: true,
      msg: "property deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete property",
      data: error,
    });
    console.log(error);
  }
}
