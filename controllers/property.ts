import Property from "models/property";
import User from "models/user";

//use case - when returning a single property
export function caViewProperty(user: any, property: any) {
  return user.role === "admin" || property.owner === user._id;
}

export function scopedProperties(user: any, properties: any) {
  if (user.role === "admin") return properties;
  return properties.filter((property: any) => property.owner === user._id);
}

export function canDeleteProperty(user: any, property: any) {
  return (
    // user.role === ROLE.ADMIN ||
    //only person that created it can delete it
    property.owner === user._id
  );
}

// get all properties
export async function fetchAllProperties(req: any, res: any, userFetching: string) {
  try {
    let properties;
    //set user
    let user = await User.findById(userFetching);

    console.log("ROLE", userFetching)

    user?.role === "admin"
      ? (properties = await Property.find())
      : (properties = await Property.findOne({ owner: `${userFetching}` }));

    res.status(200).json({
      success: true,
      msg: "properties fetched successfully",
      data: properties,
      user,
      userFetching,
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
export async function createProperty(req: any, res: any, userFetching: string) {
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

    console.log("OWNER HERERE", userFetching);

    const property = new Property({
      ...req.body,
      owner: userFetching
    });

    const newProperty = await property.save();

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

//fetch property by id
export async function fetchSingleProperty(req: any, res: any, owner: string) {
  try {
    let property = await Property.findById(req.query.id).populate("owner");
    res.status(200).json({
      success: true,
      msg: "property fetched successfully",
      data: property,
      owner,
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

    const properties = await Property.find({ ...findParams });

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
