import Booking from "models/booking";

// get all bookings
export async function fetchAllBookings(req: any, res: any) {
  try {
    let bookings = await Booking.find();

    res.json({
      success: true,
      msg: "bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  bookings",
      data: error,
    });
    console.log(error);
  }
}


// create a booking
export async function createBooking(req: any, res: any) {
  try {
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

    const booking = new Booking({
      ...req.body,
    });

    const newBooking = await booking.save();

    return res.json({
      success: true,
      msg: "New booking created",
      _id: newBooking?._id,
      name: newBooking?.name,
      image: newBooking?.image,
      unit: newBooking?.unit,
      start_date: newBooking?.start_date,
      end_date: newBooking?.end_date,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch booking by id
export async function fetchSingleBooking(req: any, res: any) {
  try {
    let booking = await Booking.findById(req.query.id);
    res.json({
      success: true,
      msg: "booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch booking",
      data: error,
    });
    console.log(error);
  }
}

//update a booking
export async function updateBooking(req: any, res: any) {
  try {
    let booking = await Booking.findById(req.query.id);

    const data = {
      name: req.body.name || booking.name,
      image: req.body.image || booking.image,
      unit: req.body.unit || booking.unit,
      start_date: req.body.start_date || booking.start_date,
      end_date: req.body.end_date || booking.end_date,
    };
    booking = await Booking.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "booking updated successfully",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update booking",
      data: error,
    });
  }
}

//delete a booking
export async function deleteBooking(req: any, res: any) {
  try {
    let booking = await Booking.findById(req.query.id);

    if (!booking) {
      //   return next("booking being deleted has not been found");
      return "booking being deleted has not been found";
    }

    await Booking.deleteOne(booking);

    res.json({
      success: true,
      msg: "booking deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to delete booking",
      data: error,
    });
    console.log(error);
  }
}

// @desc    search
// @route   GET /api/booking?searchQuery=searchQuery
export async function searchBooking(req: any, res: any, searchQuery: string) {
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

    const booking = await Booking.find({ ...findParams });

    res.status(200).json({
      success: true,
      msg: `${searchQuery} searched successfully`,
      data: booking,
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
