import User from "models/user";
import Fuse from "fuse.js";

// get all users
export async function fetchAllUsers(req: any, res: any) {
  try {
    let users = await User.find();
    res.status(200).json({
      success: true,
      msg: "users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  users",
      data: error,
    });
    console.log(error);
  }
}

//fetch User by id
export async function fetchSingleUser(req: any, res: any) {
  try {
    let user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      msg: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch User",
      data: error,
    });
    console.log(error);
  }
}

//update a User
export async function updateUser(req: any, res: any) {
  try {
    let user = await User.findById(req.params.id);

    const data = {
      first_name: req.body.first_name || user.first_name,
      last_name: req.body.last_name || user.last_name,
      phone_number: req.body.phone_number || user.phone_number,
      role: req.body.role || user.role,
      national_id: req.body.national_id || user.national_id,
    };
    user = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update User",
      data: error,
    });
  }
}

//delete a User
export async function deleteUser(req: any, res: any) {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      //   return next("User being deleted has not been found");
      return "User being deleted has not been found";
    }

    await User.deleteOne(user);

    res.json({
      success: true,
      msg: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete User",
      data: error,
    });
    console.log(error);
  }
}

// @desc    search
// @route   GET /api/property?searchQuery=searchQuery
export async function searchUser(req: any, res: any) {
  let searchQuery = req.query.searchQuery;
  try {
    let users = await User.find();
    const options = {
      keys: ["last_name", "first_name", "email"],
      threshold: 0.3,
    };

    if (searchQuery?.replace(/%/g, "")) {
      const formatText = searchQuery?.replace(/%/g, "");
      const fuse = new Fuse(users, options);
      users = fuse.search(formatText)?.map(({ item }) => item);
    }

    res.status(200).json({
      success: true,
      msg: `${searchQuery} searched successfully`,
      data: users,
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
