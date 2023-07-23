import { getPageInfo } from "helpers/page_info";
import successfulPaymentEmail from "helpers/successfulPaymentEmail";
import Bills from "models/bills";
import Payments from "models/payments";
import Tenant from "models/tenant";

// get all payments
export async function fetchAllPayments(req: any, res: any) {
  const page = req.query?.page ? parseInt(req.query.page) : 1;
  const limit = req.query?.limit ? req.query?.limit : 10;
  try {
    const [payments, paymentsCount] = await Promise.all([
      Payments.find()
        .populate({ path: "bills" })
        .skip((page - 1) * limit)
        .limit(limit),
      Payments.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      msg: "payments fetched successfully",
      data: payments,
      pageInfo: getPageInfo(limit, paymentsCount, page),
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
    let payment = await Payments.findById(req.query.id).populate({
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

// FETCH PAYMENTS BY TENANT
export async function fetchPaymentsByTenant(req: any, res: any, userId: string) {
  try {
    let payments = await Payments.find({ tenant: req.query.id })
      .populate("bills")
      .populate("tenant");
    res.status(200).json({
      success: true,
      msg: "Tenant's payments fetched successfully",
      data: payments,
    });

    if (payments[0].tenant.user != userId) {
      return res.status(403).json({
        success: false,
        msg: "You are not authorized to view this tenant's payments",
      });
    }

  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch tenant's payments",
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
  const secretHash = process.env.NEXT_PUBLIC_FW_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== secretHash) {
    return res.status(401).end();
  }

  const payload = req.body;

  try {
    let payment = await Payments.findById(payload.data.tx_ref).populate("bills").populate({ path: "tenant", populate: { path: "user" } });

    const {
      tenant: { _id: tenantId }
    } = payment._doc;

    // Check if the user has made any previous payments
    if (payload.data.status === "successful") {
      const userPaymentsCount = await Bills.countDocuments({ tenant: tenantId, type: "RENT", status: "PAID" });

      try {
        if (userPaymentsCount === 0) {
          const tenant = await Tenant.findById(tenantId);

          const tenantData = {
            ...tenant._doc,
            status: "ACTIVE",
          }

          console.log("TENANT DATA", tenantData);

          await Tenant.findByIdAndUpdate(tenantId, tenantData, {
            new: true,
          });

        }

      } catch (error) {
        console.log("ERROR", error);
        return res.status(400).json({
          success: false,
          msg: "Failed to update tenant",
          error: error,
        });
      }

    }


    const data = {
      ...payment._doc,
      status: payload.data.status.toUpperCase(),
      amountPaid: payload.data.amount,
    };

    const updated = await Payments.findByIdAndUpdate(payload.data.tx_ref, data, {
      new: true,
    });

    if (payload.data.status === "successful") {

      if (payment.amount <= payload.data.amount) {
        for (let i = 0; i < payment.bills.length; i++) {
          const bill = payment.bills[i];
          bill.status = "PAID";
          await bill.save();
        }
      } else {
        let amountLeft = payload.data.amount;
        for (let i = 0; i < payment.bills.length; i++) {
          const bill = payment.bills[i];
          if (amountLeft <= bill.amount) {
            bill.status = "PARTIAL";
            bill.amountPaid = amountLeft;
            try {
              await Bills.findByIdAndUpdate(bill._id, bill, {
                new: true,
              });
            } catch (error) {
              console.log("ERROR", error);
              return res.status(400).json({
                success: false,
                msg: "Failed to update bill",
                error: error,
              });
            }
            break;
          } else {
            bill.status = "PAID";
            bill.amountPaid = bill.amount;
            try {
              await Bills.findByIdAndUpdate(bill._id, bill, {
                new: true,
              });
              amountLeft = amountLeft - bill.amount;
            } catch (error) {
              console.log("ERROR", error);
              return res.status(400).json({
                success: false,
                msg: "Failed to update bill",
                error: error,
              });
            }
          }
        }
      }

      // Send email to tenant
      await successfulPaymentEmail(payment.tenant, payment.bills, res);

      return res.json({
        success: true,
        msg: "Payment updated",
        data: updated,
      });
    }

  } catch (error) {
    console.log("ERROR", error);
    return res.status(400).json({
      success: false,
      msg: "Failed to update payment",
      error: error,
    });
  }
}


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
