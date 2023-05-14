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
