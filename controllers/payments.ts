import Payments from "models/payments";

// get all payments
export async function fetchAllPayments(req: any, res: any) {
  try {
    let payments = await Payments.find().populate({ path: "bills" });
    res.status(200).json({
      success: true,
      msg: "payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch  payments",
      data: error,
    });
    console.log(error);
  }
}

// create a Payments
export async function createPayments(req: any, res: any) {
  try {
    const payment = new Payments({
      ...req.body,
    });

    await payment.save();

    return res.json({
      success: true,
      msg: "New Payments created",
      data: payment,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  }
}

//fetch Payments by id
export async function fetchSinglePayment(req: any, res: any) {
  try {
    let payment = await Payments.findById(req.params.id).populate({
      path: "bills",
    });
    res.status(200).json({
      success: true,
      msg: "Payment fetched successfully",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to fetch Payments",
      data: error,
    });
    console.log(error);
  }
}

//update a Payments
export async function updatePayments(req: any, res: any) {
  try {
    let payment = await Payments.findById(req.params.id).populate({
      path: "bills",
    });

    const data = {
      name: req.body.bills || payment.bills,
      paymentId: req.body?.paymentId || payment?.paymentId,
    };
    payment = await Payments.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      msg: "Payments updated successfully",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "failed to update Payments",
      data: error,
    });
  }
}

export async function flutterwaveWebhook(req: any, res: any) {
  // If you specified a secret hash, check for the signature
  const secretHash = process.env.NEXT_PUBLIC_FW_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || (signature !== secretHash)) {
    // This request isn't from Flutterwave; discard
    res.status(401).end();
  }

  const payload = req.body;

  try {
    console.log("FINDING PAYMENT", payload.data.tx_ref);
    console.log("PAYLOAD", payload);
    let payment = await Payments.findById(payload.data.tx_ref);
    console.log("PAYMENT FOUND", payment)

    const data = {
      ...payment,
      status: payment.data.status.toUpperCase(),
    };

    await Payments.findByIdAndUpdate(payload.data.tx_ref, data, {
      new: true,
    });
    
  } catch (error) {
    console.log("ERROR", error)
    res.status(400).json({
      success: false,
      msg: "Failed to update payment",
      data: error,
    });
  }}

  //delete a Payments
  export async function deletePayment(req: any, res: any) {
    try {
      let payment = await Payments.findById(req.params.id);

      if (payment) {
        //   return next("Payments being deleted has not been found");
        return "Payment being deleted has not been found";
      }

      await Payments.deleteOne(payment);

      res.json({
        success: true,
        msg: "Payment deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        msg: "failed to delete Payments",
        data: error,
      });
      console.log(error);
    }
  }
