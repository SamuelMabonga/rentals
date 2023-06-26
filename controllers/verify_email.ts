import User from "models/user";

// verify email
export async function verifyEmail(req: any, res: any) {
  try {
    let user = await User.findById(req.query.id);

    user = await User.findByIdAndUpdate(
      req.params.id,
      { isEmail_verified: true },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      msg: "user email verified fetched successfully",
      data: user,
    });
    res.redirect("http://localhost:3000/verified-email");
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to verify email",
      data: error,
    });
  }
}
