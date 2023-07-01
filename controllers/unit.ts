import Unit from "models/unit";
import Tenant from "models/tenant";
import UnitType from "models/unitType";
import { getPageInfo } from "helpers/page_info";

// get all units
export async function fetchAllUnits(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const { unitType } = req.query;
    // let units = await Unit.find().populate("unitType");

    console.log("UNIT TYPE", unitType);

    let units;
    let unitsCount = Unit.countDocuments();

    unitType !== undefined
      ? (units = await Unit.find({ unitType: unitType })
          .populate({ path: "unitType" })
          .skip((page - 1) * limit)
          .limit(limit))
      : // .populate({
        //   path: "tenant",
        //   populate: [{ path: "user" }],
        // })
        (units = await Unit.find().populate({ path: "unitType" }));
    // .populate({
    //   path: "tenant",
    //   populate: [{ path: "user" }],
    // })

    res.status(200).json({
      success: true,
      msg: "units fetched successfully",
      data: units,
      pageInfo: getPageInfo(limit, unitsCount, page),
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
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;

  try {
    const [units, unitsCount] = await Promise.all([
      Unit.find({ "property": id })
        .populate({
          path: "unitType",
       })
        .skip((page - 1) * limit)
        .limit(limit),
      Unit.countDocuments(),
    ]);

    // .populate({
    //   path: "tenant",
    //   populate: [{ path: "user" }],
    // })

    res.status(200).json({
      success: true,
      msg: "Property units fetched successfully",
      data: units,
      pageInfo: getPageInfo(limit, unitsCount, page),
    });
  } catch (error) {
    console.log("ERROR MSG", error);
    res.status(400).json({
      success: false,
      msg: "Failed to fetch property units",
      data: error,
    });
  }
}

// fetch units by unit type
export async function fetchUnitsByUnitType(req: any, res: any) {
  const {
    query: { id, searchQuery },
  }: any = req;
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;

  try {
    const [units, unitsCount] = await Promise.all([
      Unit.find({ "unitType": id })
        .populate({
          path: "unitType",
        })
        .skip((page - 1) * limit)
        .limit(limit),
      Unit.countDocuments(),
    ]);

    // .populate({
    //   path: "tenant",
    //   populate: [{ path: "user" }],
    // })

    res.status(200).json({
      success: true,
      msg: "Unit type units fetched successfully",
      data: units,
      pageInfo: getPageInfo(limit, unitsCount, page),
    });
  } catch (error) {
    console.log("ERROR MSG", error);
    res.status(400).json({
      success: false,
      msg: "Failed to fetch unit type units",
      data: error,
    });
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
      status: "AVAILABLE",
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
      // tenant: req.body.tenant || unit.tenant,
      unitType: req.body.unitType || unit.unitType,
      status: req.body.status || unit.status,
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
