import Unit from "models/unit";
import Tenant from "models/tenant";
import UnitType from "models/unit_type";

// get all units
export async function fetchAllUnits(req: any, res: any) {
  try {
    const {
      unitType
    } = req.query
    // let units = await Unit.find().populate("unitType");


    console.log("UNIT TYPE", unitType)

    let units

    unitType !== undefined ?
      (units = await Unit.find({ unitType: unitType }).populate({ path: "unitType" }).populate({
        path: "tenant",
        populate: [{ path: "user" }],
      }))
      : (units = await Unit.find().populate({ path: "unitType" }).populate({
        path: "tenant",
        populate: [{ path: "user" }],
      }));

    res.status(200).json({
      success: true,
      msg: "units fetched successfully",
      data: units,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  units",
      data: error,
    });
    console.log(error);
  }
}

// get all units
export async function fetchAllPropertyUnits(req: any, res: any) {
  const {
    query: { id, searchQuery },
  }: any = req;

  console.log("PROPERTY ", id)
  
  try {
    let units = await Unit.find()
      .populate({ path: "unitType" })
      // .populate({
      //   path: "tenant",
      //   populate: [{ path: "user" }],
      // })
      
    res.status(200).json({
      success: true,
      msg: "Property units fetched successfully",
      data: units,
    });
  } catch (error) {
    console.log("ERROR MSG", error)
    res.status(400).json({
      success: false,
      msg: "Failed to fetch property units",
      data: error,
    });
    console.log(error);
  }
}

// create a unit
export async function createUnit(req: any, res: any) {
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

    const unit = new Unit({
      ...req.body,
      status: "Vacant"
    });

    const newUnit = await unit.save();

    return res.json({
      success: true,
      msg: "New unit created",
      _id: newUnit?._id,
      name: newUnit?.name,
      image: newUnit?.image,
      tenant: newUnit?.tenant,
      unit_type: newUnit?.unit_type,
      unit_status: newUnit?.unit_status,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch unit by id
export async function fetchSingleUnit(req: any, res: any) {
  try {
    let unit = await Unit.find({ _id: req.query.id });
    res.status(200).json({
      success: true,
      msg: "unit fetched successfully",
      data: unit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch unit",
      data: error,
    });
    console.log(error);
  }
}

//update a unit
export async function updateUnit(req: any, res: any) {
  try {
    let unit = await Unit.findById(req.params.id);

    const data = {
      name: req.body.name || unit.name,
      image: req.body.image || unit.image,
      tenant: req.body.tenant || unit.tenant,
      unit_type: req.body.unit_type || unit.unit_type,
      unit_status: req.body.unit_status || unit.unit_status,
    };
    unit = await Unit.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "unit updated successfully",
      data: unit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update unit",
      data: error,
    });
  }
}

//delete a unit
export async function deleteUnit(req: any, res: any) {
  try {
    let unit = await Unit.findById(req.params.id);

    if (!unit) {
      //   return next("unit being deleted has not been found");
      return "unit being deleted has not been found";
    }

    await Unit.deleteOne(unit);

    res.json({
      success: true,
      msg: "unit deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete unit",
      data: error,
    });
    console.log(error);
  }
}
