import { getPageInfo } from "helpers/page_info";
import Property from "models/property";

//@PUBLIC
// @desc    get all properties
// @route   GET /api/property
export async function fetchAllProperties(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [properties, propertiesCount] = await Promise.all([
      Property.find()
        .skip((page - 1) * limit)
        .limit(limit),
      Property.countDocuments({ status: "ACTIVE" }),
    ]);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        success: true,
        msg: "Properties fetched successfully",
        data: properties,
        pageInfo: getPageInfo(limit, propertiesCount, page),
      })
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "failed to fetch  properties",
      data: error,
    });
    // console.log(error);
  }
}

//@PUBLIC
// @desc    get single property
// @route   GET /api/property/:id
export async function fetchSingleProperty(req: any, res: any) {
  console.log("fetching property", req.query.id);
  try {
    let property = await Property.findById(req.query.id);
    res.json({
      success: true,
      msg: "property fetched successfully",
      data: property,
    });
  } catch (error) {
    res.json({
      success: false,
      msg: "failed to fetch property",
      data: error,
    });
    console.log("PROPERTY CAST ERROR", error);
  }
}

// @PUBLIC
// @desc    search
// @route   GET /api/property?searchQuery=searchQuery
export async function searchProperty(req: any, res: any, searchQuery: string) {
  try {
    let findParams = searchQuery
      ? {
          $text: {
            $search: searchQuery,
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
        }
      : {};

    const properties = await Property.find({ ...findParams, status: "ACTIVE" });

    res.status(200).json({
      success: true,
      msg: `${searchQuery} searched successfully`,
      data: properties,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: `failed to search ${searchQuery}`,
      data: error,
    });
    console.log(error);
  }
}
