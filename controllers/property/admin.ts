import { getPageInfo } from "helpers/page_info";
import UserRoles from "models/userRoles";

//@AUTH
// @desc    fetch properties by roles
// @route   GET /api/property/user/:id
export async function fetchPropertiesByRoles(req: any, res: any, user: string) {
  // let ownerId = req.query.ownerId;
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [properties, propertiesCount] = await Promise.all([
      UserRoles.find({
        user: `${user}`,
        role: { $ne: "64aef65e5c197c23de2f429d" },
      })
        .populate("property")
        .populate("role")
        .skip((page - 1) * limit)
        .limit(limit),
      UserRoles.countDocuments({
        user: `${user}`,
        role: { $ne: "64aef65e5c197c23de2f429d" },
      }),
    ]);

    res.status(200).json({
      success: true,
      msg: "Properties fetched successfully",
      data: properties.map((property) => ({
        ...property.property._doc,
        role: property.role,
      })),
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
