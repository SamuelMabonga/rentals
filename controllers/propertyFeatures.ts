import PropertyFeatures from "models/propertyFeatures";

// get all features
export async function fetchAllPropertyFeatures(req: any, res: any) {
  try {
    let propertyFeature = await PropertyFeatures.find().populate("feature").populate("billingPeriod");
    res.status(200).json({
      success: true,
      msg: "Property features fetched successfully",
      data: propertyFeature,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch property features",
      data: error,
    });
    console.log(error);
  }
}

// create a feature
export async function createPropertyFeature(req: any, res: any) {
  try {
    const requiredFields = ["feature", "price", "billingPeriod"];

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

    const propertyFeature = new PropertyFeatures({
      ...req.body,
    });

    const newPropertyFeature = await propertyFeature.save();

    return res.json({
      success: true,
      msg: "New property feature created",
      _id: newPropertyFeature?._id,
      name: newPropertyFeature?.name,
      image: newPropertyFeature?.image,
      rate: newPropertyFeature?.rate,
      price: newPropertyFeature?.price
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch property feature by id
export async function fetchSinglePropertyFeature(req: any, res: any) {
  try {
    let propertyFeature = await PropertyFeatures.findById(req.params.id);
    res.status(200).json({
      success: true,
      msg: "Property feature fetched successfully",
      data: propertyFeature,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch property feature",
      data: error,
    });
    console.log(error);
  }
}

//update a property feature
export async function updatePropertyFeature(req: any, res: any) {
  try {
    let propertyFeature = await PropertyFeatures.findById(req.params.id);

    const data = {
      name: req.body.name || propertyFeature.name,
      image: req.body.image || propertyFeature.image,
      rate: req.body.rate || propertyFeature.rate,
      price: req.body.price || propertyFeature.price,
    };
    propertyFeature = await PropertyFeatures.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "Property feature updated successfully",
      data: propertyFeature,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update property feature",
      data: error,
    });
  }
}

//delete a property feature
export async function deletePropertyFeature(req: any, res: any) {
  try {
    let propertyFeature = await PropertyFeatures.findById(req.params.id);

    if (!propertyFeature) {
      //   return next("feature being deleted has not been found");
      return "Property feature being deleted has not been found";
    }

    await PropertyFeatures.deleteOne(propertyFeature);

    res.json({
      success: true,
      msg: "Property feature deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to delete property feature",
      data: error,
    });
    console.log(error);
  }
}