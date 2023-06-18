/* eslint-disable no-underscore-dangle */
import * as dbUtils from "./dbBuilder";
import { getPageInfo } from "./apiHelper";

const returnContent = (
  defaultItemName: any,
  defaultCollection: any,
  defaultCollectionName: any
) => {
  // @desc    Create a new object
  // @route   POST /api/route
  // @access  restricted
  const createEntity = async (req: any, res: any) => {
    try {
      // Create the Entity
      const result = await dbUtils.createAndSave(
        req.body,
        defaultCollection,
        defaultItemName,
        defaultCollection
      );

      return res.status(result.statusCode).json({
        error: !result.success ? result.message : false,
        success: result.success,
        result: result.result,
      });
    } catch (err: any) {
      const errorMsg = `A server error occurred while attempting to create a new ${defaultItemName}`;
      console.error(errorMsg, err);
      res.status(500).json({
        success: false,
        error: errorMsg,
        msg: Object.keys(err),
      });
    }
  };

  // @desc    Get all entities
  // @route   GET /api/route/entities
  // @access  public
  const getAllEntities = async (req: any, res: any) => {
    try {
      const page = req.query?.page ? parseInt(req.query.page) : 1;
      const limit = req.query?.limit ? req.query?.limit : 10;

      const _entity = await dbUtils.getAllItems(
        defaultCollection,
        defaultCollectionName,
        page,
        limit
      );

      return res.status(_entity.statusCode).json({
        success: _entity.success,
        message: _entity.message,
        pageInfo: getPageInfo(limit, _entity.count, page),
        count: _entity.count,
        result: _entity.result,
      });
    } catch (err) {
      const errorMsg = `A server error occurred while attempting to get all ${defaultItemName}s.`;
      console.error(errorMsg, err);
      res.status(500).json({ success: false, error: errorMsg });
    }
  };

  // @desc    Get single Entity
  // @route   GET /api/router/search
  // @access  public
  const searchForEntity = async (req: any, res: any) => {
    const { searchQuery } = req.body;

    console.log("Search params are", req.params);
    try {
      const _entity = await dbUtils.getItem(
        searchQuery ? { $text: { $search: searchQuery } } : {},
        defaultCollection,
        defaultCollectionName,
        defaultItemName
      );

      return res.status(_entity.statusCode).json({
        success: _entity.success,
        message: _entity.message,
        count: _entity.count,
        result: _entity.result,
      });
    } catch (err: any) {
      const errorMsg = `A server error occurred while attempting to search for ${defaultItemName} with searchQuery: ${searchQuery}.`;
      console.error(errorMsg, err);
      res.status(500).json({ success: false, error: errorMsg });
    }
  };

  // @desc    Get single Entity
  // @route   GET /api/pages/entities/:id
  // @access  public
  const getSingleEntity = async (req: any, res: any) => {
    const { id } = req.params;
    const incrementViews = req?.query?.incrementViews;

    try {
      const _entity = await dbUtils.getItem(
        { _id: id },
        defaultCollection,
        defaultCollectionName,
        defaultItemName
      );

      if (incrementViews) {
        await dbUtils.findAndUpdate(
          { findParams: { _id: id } },
          { updateInfo: { $inc: { number_of_views: 1 } } },
          { collection: defaultCollection },
          { itemName: defaultItemName },
          { collectionName: defaultCollection }
        );
      }

      return res.status(_entity.statusCode).json({
        success: _entity.success,
        message: _entity.message,
        count: _entity.count,
        result: _entity.result,
      });
    } catch (err: any) {
      const errorMsg = `A server error occurred while attempting to get ${defaultItemName} with id: ${id}.`;
      console.error(errorMsg, err);
      res.status(500).json({ success: false, error: errorMsg });
    }
  };

  // @desc    DELETE a single Entity
  // @route   DELETE /api/pages/entities/:id
  // @access  restricted
  const deleteEntity = async (req: any, res: any) => {
    const { id } = req.params;

    try {
      await dbUtils
        .findAndDelete(
          { _id: id },
          defaultCollection,
          defaultItemName,
          defaultCollectionName
        )
        .then((deleteResult) => {
          return res.status(deleteResult.statusCode).json({
            success: deleteResult.success,
            message: deleteResult.message,
          });
        });
    } catch (err) {
      const errorMsg = `A server error occurred while attempting to delete a ${defaultItemName} with id:${id}`;
      console.error(errorMsg, err);
      res.status(500).json({ success: false, error: errorMsg });
    }
  };

  // @desc    Update a single Entity
  // @route   PATCH /api/pages/entities/:id
  // @access  restricted
  const updateEntity = async (req: any, res: any) => {
    const { id } = req.params;
    try {
      const update = req.body;
      if (!id || !update) {
        return res.status(400).json({
          success: false,
          message: `Please provide all the details needed to locate and update the ${defaultItemName}. No ${
            !id && !update
              ? "id and no body"
              : !id
              ? "id"
              : !update
              ? "body"
              : ""
          } is provided`,
        });
      }
      await dbUtils
        .findAndUpdate(
          { _id: id },
          update,
          defaultCollection,
          defaultItemName,
          defaultCollection
        )
        .then((updateResult) => {
          return res.status(updateResult.statusCode).json({
            success: updateResult.success,
            message: updateResult.message,
          });
        });
    } catch (err) {
      const errorMsg = `A server error occurred while attempting to update a ${defaultItemName} with id ${id}`;
      console.error(errorMsg, err);
      res.status(500).json({ success: false, error: errorMsg });
    }
  };

  return {
    createEntity,
    getAllEntities,
    getSingleEntity,
    deleteEntity,
    updateEntity,
    searchForEntity,
  };
};

export default returnContent;
