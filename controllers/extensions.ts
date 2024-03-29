import { getPageInfo } from "helpers/page_info";
import Bills from "models/bills";
import Extensions from "models/extensions";
import Property from "models/property";
import Fuse from "fuse.js";

// get all properties
//none admin fetch properties
export async function fetchOwnerProperties(req: any, res: any) {
  let ownerId = req.query.ownerId;
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [properties, propertiesCount] = await Promise.all([
      Property.find({ owner: `${ownerId}` })
        .skip((page - 1) * limit)
        .limit(limit),
      Property.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      msg: "properties fetched successfully",
      data: properties,
      pageInfo: getPageInfo(limit, propertiesCount, page),
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
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [properties, propertiesCount] = await Promise.all([
      Property.find()
        .skip((page - 1) * limit)
        .limit(limit),
      Property.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      msg: "properties fetched successfully",
      data: properties,
      pageInfo: getPageInfo(limit, propertiesCount, page),
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

// fetch extensions by property id
export async function fetchExtensionsByProperty(req: any, res: any) {
  const {
    query: { id, searchQuery, status },
  }: any = req;

  let queryCondition: any = { property: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [extensions, extensionsCount] = await Promise.all([
      Extensions.find(queryCondition)
        .populate({ path: "tenant", populate: [{ path: "user" }, {path: "unit"}] })
        .populate("bill")
        .skip((page - 1) * limit)
        .limit(limit),
      Extensions.countDocuments(queryCondition),
    ]);

    return res.status(200).json({
      success: true,
      msg: "Extensions fetched successfully",
      data: extensions,
      pageInfo: getPageInfo(limit, extensionsCount, page),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Failed to fetch  extensions",
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
        const bill = await Bills.findById(req.body.bill);

        bill.extended = true;

        console.log("UPDATED BILL", bill);

        await Bills.findByIdAndUpdate(req.body.bill, bill, {
          new: true,
        });
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

// Accept an extension
export async function acceptExtension(req: any, res: any) {
  const { extensionId } = req.body;
  try {
    let extension = await Extensions.findById(extensionId);

    const data = {
      ...extension._doc,
      status: "ACCEPTED"
    };

    extension = await Extensions.findByIdAndUpdate(extensionId, data, {
      new: true,
    });

    // FIND AND UPDATE BILL
    try {
      const bill = await Bills.findById(extension.bill.toString());

      const billData = {
        ...bill,
        pay_by: extension.pay_by,
      }

      await Bills.findByIdAndUpdate(extension.bill, billData, {
        new: true,
      });

    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        msg: "Failed to update bill",
        data: error,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Extension accepted successfully",
      data: extension,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Failed to accept extension",
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
export async function searchExtensions(req: any, res: any) {
  const {
    id, status, searchQuery
  } = req.query

  let queryCondition: any = { property: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  try {
    let extensions = await Extensions.find(queryCondition)
      .populate({ path: "tenant", populate: [{ path: "user" }] })
      .populate({path: "bill", populate: [{path: "propertyFeature"}]});

    const options = {
      keys: ["tenant.user.name", "tenant.user.email", "bill.propertyFeature.name"],
      threshold: 0.3,
    }

    if (searchQuery?.replace(/%/g, "")) {
      const formatText = searchQuery?.replace(/%/g, "");
      const fuse = new Fuse(extensions, options);
      extensions = fuse.search(formatText)?.map(({ item }) => item);
    }

    res.status(200).json({
      success: true,
      msg: `${searchQuery} searched successfully`,
      data: extensions,
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


// statistics
export async function extensionStatistics(req: any, res: any) {
  const {
    query: { id },
  }: any = req;

  if (!id) {
    return res.status(400).json({
      success: false,
      msg: "No property provided",
    });
  }

  try {
    const [
      totalExtensions,
      totalExtensionsPending,
      totalExtensionsAccepted,
      totalExtensionsRejected,
    ] = await Promise.all([
      Extensions.countDocuments({ property: id }),
      Extensions.countDocuments({ property: id, status: "PENDING" }),
      Extensions.countDocuments({ property: id, status: "ACCEPTED" }),
      Extensions.countDocuments({ property: id, status: "REJECTED" }),
    ])

    res.json({
      success: true,
      msg: "Extension statistics fetched successfully",
      data: {
        totalExtensions,
        totalExtensionsPending,
        totalExtensionsAccepted,
        totalExtensionsRejected,
      }
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch extension statistics",
      data: error,
    });
  }
}
