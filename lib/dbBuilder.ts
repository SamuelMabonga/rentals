// Creates a new item and returns the item without saving it to mongoDB
export const create = (
  item: any,
  collection: any,
  itemName: any,
  collectionName: any
) => {
  try {
    const result = new collection({
      ...item,
    });
    return {
      statusCode: 200,
      success: true,
      message: `${itemName || "Item"} successfully created${
        collectionName ? ` in the ${collectionName} collection` : ""
      }.`,
      result,
    };
  } catch (err) {
    const message = `There was a server error while attempting to create the ${
      itemName || "item"
    }${collectionName ? ` in the ${collectionName} collection` : ""}.`;
    console.log(message, item, "\nError:", err);
    return {
      statusCode: 500,
      success: false,
      message,
    };
  }
};

// Saves an already created Item to mongoDB
export const save = async (item: any, itemName: any, collectionName: any) => {
  try {
    const result = await item.save();

    return {
      statusCode: 200,
      success: true,
      message: `${itemName || "Item"} successfully saved${
        collectionName ? ` to the ${collectionName} collection` : ""
      }.`,
      result,
    };
  } catch (err) {
    const message = `There was a server error while attempting to save the ${
      itemName || "item"
    }${collectionName ? ` to the ${collectionName} collection` : ""}.`;
    console.log(message, item, "\nError:", err);
    return {
      statusCode: 500,
      success: false,
      message,
    };
  }
};

// Creates and saves a new item to mongoDB
export const createAndSave = async (
  item: any,
  collection: any,
  itemName: any,
  collectionName: any
) => {
  try {
    const newItem = new collection({
      ...item,
    });
    const result = await collection.create(newItem);

    return {
      statusCode: 200,
      success: true,
      message: `${itemName || "Item"} successfully created and saved${
        collectionName ? ` to the ${collectionName} collection` : ""
      }.`,
      result,
    };
  } catch (err) {
    const message = `There was a server error while attempting to create and save the ${
      itemName || "item"
    }${collectionName ? ` to the ${collectionName} collection` : ""}.`;
    console.log(message, item, "\nError:", err);
    return {
      statusCode: 500,
      success: false,
      message,
    };
  }
};

// Updates an existing item in mongoDB
export const findAndUpdate = async (
  findParams: any,
  updateInfo: any,
  collection: any,
  itemName: any,
  collectionName: any
) => {
  try {
    const result = await collection.findOneAndUpdate(
      { ...findParams },
      { ...updateInfo }
    );

    return {
      statusCode: 200,
      success: true,
      message: `${itemName || "Item"} successfully updated${
        collectionName ? ` in the ${collectionName} collection` : ""
      }.`,
      result,
    };
  } catch (err) {
    const message = `There was a server error while attempting to update the ${
      itemName || "item"
    }${collectionName ? ` from the ${collectionName} collection` : ""}.`;
    console.log(message, "\nError:", err);
    return {
      statusCode: 500,
      success: false,
      message,
    };
  }
};

export const findAndDelete = async (
  findParams: any,
  collection: any,
  itemName: any,
  collectionName: any
) => {
  let item = await collection.find({ ...findParams });

  try {
    if (!item || (Array.isArray(item) && !item?.length)) {
      return {
        statusCode: 404,
        success: false,
        message: `No such ${itemName || "item"} was found${
          collectionName ? ` in the ${collectionName} collection` : ""
        }.`,
      };
    }

    item = item[0];
    console.log("Item is", item);
    const result = await collection.deleteOne(item);

    return {
      statusCode: 200,
      success: true,
      message: `${itemName || "Item"} successfully deleted`,
      result,
    };
  } catch (err: any) {
    const message = `There was a servers! error while attempting to delete the ${
      itemName || "item"
    }${collectionName ? ` from the ${collectionName} collection` : ""}.`;
    console.error(message, item, "\nError:", err);
    return {
      statusCode: 500,
      success: false,
      message,
      error: err.message,
    };
  }
};

export const getAllItems = async (
  collection: any,
  collectionName: any,
  page: any = 1,
  limit: any = 10
) => {
  try {
    const [result, count] = await Promise.all([
      collection
        .find()
        .skip((page - 1) * limit)
        .limit(limit),
      collection.countDocuments(),
    ]);

    return {
      statusCode: 200,
      success: true,
      message: `${
        collectionName
          ? `All items from ${collectionName} collection`
          : "All items"
      } successfully retrieved.`,
      result,
      count,
    };
  } catch (err) {
    const message = `There was a server error while attempting to get all items ${
      collectionName ? `from the ${collectionName} collection` : ""
    }.`;
    console.log(message, "\nError:", err);
    return {
      statusCode: 500,
      success: false,
      message,
      count: 0,
    };
  }
};

export const getItem = async (
  findParams: any,
  collection: any,
  collectionName: any,
  itemName: any
) => {
  try {
    const result = await collection.find({ ...findParams });

    if (!result.length) {
      return {
        statusCode: 404,
        success: false,
        message: `No such ${itemName || "item"} was found${
          collectionName ? ` in the ${collectionName} collection.` : "."
        }`,
      };
    }

    return {
      statusCode: 200,
      success: true,
      message: `${itemName || "Item"} get operation was successful.`,
      count: result.length,
      result: result,
    };
  } catch (err) {
    const message = `There was a server error while attempting to get a single item ${
      collectionName ? `from the ${collectionName} collection` : ""
    }.`;
    console.log(message, itemName, "\nError:", err);
    return {
      statusCode: 500,
      success: false,
      message,
    };
  }
};
