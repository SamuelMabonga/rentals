import { getPageInfo } from "helpers/page_info";
import Bills from "models/bills";
import Extensions from "models/extensions";
import Property from "models/property";
import TenancyModification from "models/tenancyModification";
import Tenant from "models/tenant";
import Unit from "models/unit";
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
export async function fetchTenancyModificationsByProperty(req: any, res: any) {
  const {
    query: { id, status },
  }: any = req;

  let queryCondition: any = { property: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [modifications, modificationsCount] = await Promise.all([
      TenancyModification.find(queryCondition)
        .populate({path: "tenant", populate: [{path: "unit"}, {path: "user"}]})
        .skip((page - 1) * limit)
        .limit(limit),
      TenancyModification.countDocuments(queryCondition),
    ]);

    return res.status(200).json({
      success: true,
      msg: "Tenancy modifications fetched successfully",
      data: modifications,
      pageInfo: getPageInfo(limit, modificationsCount, page),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Failed to fetch tenancy modifications ",
      data: error,
    });
    console.log(error);
  }
}


// create a property
export async function createTenancyModification(req: any, res: any) {
  try {
    const tenancyModification = new TenancyModification({
      ...req.body,
    });

    const newTicket = await tenancyModification.save();

    return res.json({
      success: true,
      msg: "New tenancy modification created successfully",
      data: newTicket,
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
export async function acceptTenancyModification(req: any, res: any) {
  const {tenancyModificationId} = req.body;
  try {
    let tenancyModification = await TenancyModification.findById(tenancyModificationId).populate("tenant");
    const unitId = tenancyModification.tenant.unit;

    const data = {
      ...tenancyModification._doc,
      status: "ACCEPTED"
    };



    tenancyModification = await TenancyModification.findByIdAndUpdate(tenancyModificationId, data, {
      new: true,
    }).populate("tenant");

    // FIND AND UPDATE TENANT
    try {
      const tenant = await Tenant.findById(tenancyModification.tenant._id.toString());
      
      const tenantData = {
        ...tenant._doc,
        endDate: tenancyModification.newDate,
      }

      await Tenant.findByIdAndUpdate(tenancyModification.tenant._id.toString(), tenantData, {
        new: true,
      });

    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        msg: "Failed to update tenant",
        data: error,
      });
    }

    // FIND AND UPDATE UNIT
    try {
      const unit = await Unit.findById(unitId)

      const unitData = {
        ...unit._doc,
        availableAfter: tenancyModification.newDate,
      }

      await Unit.findByIdAndUpdate(unitId, unitData, {
        new: true,
      })

    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        msg: "Failed to update unit",
        data: error,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Tenancy modification accepted successfully",
      data: tenancyModification,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Failed to accept tenancy modification",
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
export async function searchModifications(req: any, res: any) {
  const {
    id, status, searchQuery
  } = req.query

  let queryCondition: any = { property: id };
  if (status && status !== "" && status !== undefined && status !== null) {
    queryCondition.status = status;
  }

  try {
    let extensions = await TenancyModification.find(queryCondition)
      .populate({ path: "tenant", populate: [{ path: "user" }] })

    const options = {
      keys: ["tenant.user.name", "tenant.user.email"],
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


// Statistics
export async function tenancyModificationStatistics(req: any, res: any) {
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
      total,
      totalAccepted,
      totalRejected,
      totalPending,
    ] = await Promise.all([
      TenancyModification.countDocuments({ property: id }),
      TenancyModification.countDocuments({ property: id, status: "ACCEPTED" }),
      TenancyModification.countDocuments({ property: id, status: "PENDING" }),
      TenancyModification.countDocuments({ property: id, status: "REJECTED" }),
    ])

    res.json({
      success: true,
      msg: "Ticket statistics fetched successfully",
      data: {
        total,
        totalAccepted,
        totalRejected,
        totalPending
      }
    })
    
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch ticket statistics",
      data: error,
    }); 
  }
}

