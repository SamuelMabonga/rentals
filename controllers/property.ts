import Property from "models/property";

// get all properties
export async function fetchAllProperties(req: any, res: any) {
  try {
    let properties = await Property.find();
    res.status(200).json({
      success: true,
      msg: "properties fetched successfully",
      data: properties,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  properties",
      data: error,
    });
    console.log(error);
  }
}

// create a property
export async function createProperty(req: any, res: any) {
  try {
    const { cover_photo, profile_photo, name, details } = req.body;
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

    return res.json({
      success: true,
      msg: "New property created",
      _id: newProperty?._id,
      name: newProperty?.name,
      details: newProperty?.details,
      price: newProperty?.price,
      building_type: newProperty?.building_type,
      number_of_units: newProperty?.number_of_units,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch property by id
export async function fetchSingleProperty(req: any, res: any) {
  try {
    let property = await Property.findById(req.query.id);
    res.status(200).json({
      success: true,
      msg: "property fetched successfully",
      data: property,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch property",
      data: error,
    });
    console.log(error);
  }
}

//update a property
export async function updateProperty(req: any, res: any) {
  try {
    let property = await Property.findById(req.params.id);

    const data = {
      name: req.body.name || property.name,
    };
    property = await Property.findByIdAndUpdate(req.params.id, data, {
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

//delete a property
export async function deleteProperty(req: any, res: any) {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      //   return next("property being deleted has not been found");
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
