import User from "models/user";

// verify email
export async function verifyEmail(req: any, res: any) {
  console.log("USER ID", req.query.id);
  try {
    let user = await User.findById(req.query.id);

    user = await User.findByIdAndUpdate(
      req.query.id,
      { isEmail_verified: true },
      {
        new: true,
      }
    );
    // res.status(200).json({
    //   success: true,
    //   msg: "user email verified fetched successfully",
    //   data: user,
    // });
    res.redirect(200, "http://localhost:3000/login");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      msg: "failed to verify email",
      data: error,
    });
  }
}
