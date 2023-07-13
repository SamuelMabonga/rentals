import { getPageInfo } from "helpers/page_info";
import UnitType from "models/unitType";

// get all unit_types
export async function fetchAllUnitTypes(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [unitTypes, unitTypesCount] = await Promise.all([
      UnitType.find()
        .populate("billingPeriod")
        .populate("defaultFeatures")
        .skip((page - 1) * limit)
        .limit(limit),
      UnitType.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      msg: "unit types fetched successfully",
      data: unitTypes,
      pageInfo: getPageInfo(limit, unitTypesCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  unit types",
      data: error,
    });
    console.log(error);
  }
}

// get all unit_types by unit
export async function fetchUnitTypesByUnit(req: any, res: any) {
  let unitId = req.query.unitId;
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [unitTypes, unitTypesCount] = await Promise.all([
      UnitType.find({ unit: unitId })
        .populate("billingPeriod")
        .populate("defaultFeatures")
        .skip((page - 1) * limit)
        .limit(limit),
      UnitType.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      msg: "unit types fetched successfully",
      data: unitTypes,
      pageInfo: getPageInfo(limit, unitTypesCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  unit types",
      data: error,
    });
    console.log(error);
  }
}

// get all unit_types by unit
export async function fetchPropertyUnitTypes(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  let propertyId = req.query.id;
  try {
    const [unitTypes, unitTypesCount] = await Promise.all([
      UnitType.find({ property: propertyId })
        .populate("billingPeriod")
        .populate({path: "defaultFeatures", populate: {path: "feature"}})
        .skip((page - 1) * limit)
        .limit(limit),
      UnitType.countDocuments({ property: propertyId }),
    ]);
    res.status(200).json({
      success: true,
      msg: "unit types fetched successfully",
      data: unitTypes,
      pageInfo: getPageInfo(limit, unitTypesCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  unit types",
      data: error,
    });
    console.log(error);
  }
}

// create a unit type
export async function createUnitType(req: any, res: any) {
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

    const unit_type = new UnitType({
      ...req.body,
    });

    const newUnitType = await unit_type.save();

    return res.json({
      success: true,
      msg: "New unit_type created",
      _id: newUnitType?._id,
      name: newUnitType?.name,
      image: newUnitType?.image,
      rate: newUnitType?.rate,
      price: newUnitType?.price,
      units: newUnitType?.units,
      defaultFeatures: newUnitType?.features,
      property: newUnitType?.property,
      created_at: newUnitType?.created_at,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch unit type by id
export async function fetchSingleUnitType(req: any, res: any) {
  try {
    let unit_type = await UnitType.findById(req.params.id)
      .populate("billingPeriod")
      .populate("defaultFeatures");
    res.status(200).json({
      success: true,
      msg: "unit type fetched successfully",
      data: unit_type,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch unit type",
      data: error,
    });
    console.log(error);
  }
}

//update a unit_type
export async function updateUnitType(req: any, res: any) {
  try {
    let unit_type = await UnitType.findById(req.query.id);

    const data = {
      ...unit_type._doc,
      name: req.body.name || unit_type.name,
      description: req.body.description || unit_type.description,
      image: req.body.image || unit_type.image,
      billingPeriod: req.body.billingPeriod || unit_type.billingPeriod,
      price: req.body.price || unit_type.price,
      defaultFeatures: req.body.defaultFeatures || unit_type.defaultFeatures,
    };
    console.log("data is", unit_type.name);
    unit_type = await UnitType.findByIdAndUpdate(req.query.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "Unit type updated successfully",
      data: unit_type,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      msg: "Failed to update unit type",
      data: error,
    });
  }
}

//delete a unit_type
export async function deleteUnitType(req: any, res: any) {
  try {
    let unit_type = await UnitType.findById(req.params.id);

    if (!unit_type) {
      //   return next("unit_type being deleted has not been found");
      return "unit_type being deleted has not been found";
    }

    await UnitType.deleteOne(unit_type);

    res.json({
      success: true,
      msg: "unit type deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete unit type",
      data: error,
    });
    console.log(error);
  }
}
