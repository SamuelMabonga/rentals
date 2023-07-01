import { getPageInfo } from "helpers/page_info";
import Feature from "models/feature";

// get all features
export async function fetchAllFeatures(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [features, featuresCount] = await Promise.all([
      Feature.find()
        .skip((page - 1) * limit)
        .limit(limit),
      Feature.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      msg: "features fetched successfully",
      data: features,
      pageInfo: getPageInfo(limit, featuresCount, page),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  features",
      data: error,
    });
    console.log(error);
  }
}

// create a feature
export async function createFeature(req: any, res: any) {
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

    const feature = new Feature({
      ...req.body,
    });

    const newFeature = await feature.save();

    return res.json({
      success: true,
      msg: "New feature created",
      _id: newFeature?._id,
      name: newFeature?.name,
      image: newFeature?.image,
      rate: newFeature?.rate,
      price: newFeature?.price,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch feature by id
export async function fetchSingleFeature(req: any, res: any) {
  try {
    let feature = await Feature.findById(req.params.id);
    res.status(200).json({
      success: true,
      msg: "feature fetched successfully",
      data: feature,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch feature",
      data: error,
    });
    console.log(error);
  }
}

//update a feature
export async function updateFeature(req: any, res: any) {
  try {
    let feature = await Feature.findById(req.params.id);

    const data = {
      name: req.body.name || feature.name,
      image: req.body.image || feature.image,
      rate: req.body.rate || feature.rate,
      price: req.body.price || feature.price,
    };
    feature = await feature.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "feature updated successfully",
      data: feature,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update feature",
      data: error,
    });
  }
}

//delete a feature
export async function deleteFeature(req: any, res: any) {
  try {
    let feature = await Feature.findById(req.params.id);

    if (!feature) {
      //   return next("feature being deleted has not been found");
      return "feature being deleted has not been found";
    }

    await Feature.deleteOne(feature);

    res.json({
      success: true,
      msg: "feature deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete feature",
      data: error,
    });
    console.log(error);
  }
}
