import Bills from "models/bills";
import Extensions from "models/extensions";
import Property from "models/property";

// get all properties
//none admin fetch properties
export async function fetchOwnerProperties(req: any, res: any) {
  let ownerId = req.query.ownerId
  try {
    let properties = await Property.find({ owner: `${ownerId}` });

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

// get admin all properties
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
export async function createExtension(req: any, res: any) {
  try {
    const { tenant } = req.body;
    const requiredFields = ["tenant"];

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

    const extension = new Extensions({
      ...req.body,
    });

    try {

      const newExtension = await extension.save();

      try {
        const bill = await Bills.findById(req.body.bill)

        bill.extended = true

        console.log("UPDATED BILL", bill)

        await Bills.findByIdAndUpdate(req.body.bill, bill, {
          new: true,
        })

      } catch (error) {
        console.log(error);
        res.status(400).json({
          success: false,
          msg: "Failed to update bill",
          data: error,
        });
      }

      return res.json({
        success: true,
        msg: "New extension created",
        data: newExtension,
      });

    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        msg: "Failed to update bill",
        data: error,
      });
    }

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
    let property = await Property.findById(req.query.id)
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
    let property = await Property.findById(req.query.id);

    if (!property) {
      // return next("property being deleted has not been found");
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
// @route   GET /api/user?searchQuery=searchQuery
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