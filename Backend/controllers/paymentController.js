import crypto from "crypto";
import axios from "axios";
import MembershipPlan from "../model/memberShipPlan.js";
import User from "../model/userModel.js";
import { calculateMembershipEndDate } from "../utils/membershipDates.js";

export const buyMembershipEsewa = async (req, res) => {
  try {
    const { planId } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const plan = await MembershipPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const price = Number(plan.price).toFixed(2);
    const transaction_uuid = `MEM_${Date.now()}`;

    user.membership = {
      ...user.membership,
      plan: plan._id,
      status: "Pending",
      paymentMethod: "eSewa",
      transactionId: transaction_uuid,
      paymentVerified: false,
      purchasedAt: new Date(),
    };

    await user.save();

    const product_code = process.env.ESEWA_MERCHANT_CODE;

    const message =
      `total_amount=${price},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const signature = crypto
      .createHmac("sha256", process.env.ESEWA_SECRET)
      .update(message)
      .digest("base64");

    res.json({
      amount: price,
      tax_amount: "0",
      total_amount: price,
      transaction_uuid,
      product_code,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${process.env.BACKEND_URL}/api/membership/esewa/success`,
      failure_url: `${process.env.BACKEND_URL}/api/membership/esewa/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    });

  } catch (error) {
    console.error("Esewa init error:", error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};
export const renewMembershipEsewa = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("membership.plan");

    if (!user || !user.membership) {
      return res.status(404).json({ message: "No membership found" });
    }

    if (user.membership.status === "Pending") {
      return res.status(400).json({
        message: "Renewal already in progress",
      });
    }

    if (user.membership.status !== "Expired") {
      return res.status(400).json({
        message: "Membership must be expired to renew",
      });
    }

    const plan = user.membership.plan;

    if (!plan) {
      return res.status(400).json({ message: "Plan not found" });
    }

    const transactionId = `RENEW_${Date.now()}_${user._id}`;

    user.membership.status = "Pending";
    user.membership.paymentMethod = "eSewa";
    user.membership.transactionId = transactionId;
    user.membership.paymentVerified = false;
    user.membership.purchasedAt = new Date();

    await user.save();

    const price = Number(plan.price).toFixed(2);

    const message = `total_amount=${price},transaction_uuid=${transactionId},product_code=${process.env.ESEWA_MERCHANT_CODE}`;

    const signature = crypto
      .createHmac("sha256", process.env.ESEWA_SECRET)
      .update(message)
      .digest("base64");

    res.json({
      amount: price,
      tax_amount: "0",
      total_amount: price,
      transaction_uuid: transactionId,
      product_code: process.env.ESEWA_MERCHANT_CODE,

      product_service_charge: "0",
      product_delivery_charge: "0",

      success_url: `${process.env.BACKEND_URL}/api/membership/esewa/success`,
      failure_url: `${process.env.BACKEND_URL}/api/membership/esewa/failure`,

      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    });
  } catch (error) {
    console.error("Renew eSewa error:", error);
    res.status(500).json({ message: "Renew failed" });
  }
};
export const esewaSuccessMembership = async (req, res) => {
  try {
    if (!req.query.data) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }

    const decoded = JSON.parse(
      Buffer.from(req.query.data, "base64").toString("utf8"),
    );

    const { transaction_uuid, status } = decoded;

    if (status !== "COMPLETE") {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }

    const user = await User.findOne({
      "membership.transactionId": transaction_uuid,
    }).populate("membership.plan");

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }

    const now = new Date();
    const endDate = calculateMembershipEndDate(
      now,
      user.membership.plan.duration,
    );

    user.membership.status = "Active";
    user.membership.paymentVerified = true;
    user.membership.startDate = now;
    user.membership.endDate = endDate;
    user.membership.transactionId = undefined;

    await user.save();

    return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
  } catch (error) {
    console.error("Esewa success error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  }
};

export const esewaCancelMembership = async (req, res) => {
  try {
    const { transaction_uuid } = req.query;

    await User.updateOne(
      {
        "membership.transactionId": transaction_uuid,
        "membership.paymentMethod": "eSewa",
        "membership.status": "Pending",
      },
      {
        $set: {
          "membership.status": "Rejected",
          "membership.transactionId": undefined,
        },
      },
    );

    res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  } catch (err) {
    console.error("ESEWA CANCEL ERROR:", err);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  }
};

export const buyMembershipKhalti = async (req, res) => {
  try {
    const { planId } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (user.membership?.status && user.membership.status !== "Expired") {
      return res.status(400).json({
        message: "You already have an active or pending membership",
      });
    }

    const amount = Number(plan.price) * 100;
    const purchase_order_id = `MEM_${Date.now()}`;

    const response = await axios.post(
      `${process.env.KHALTI_BASE_URL}/epayment/initiate/`,
      {
        return_url: `${process.env.BACKEND_URL}/api/membership/khalti/success`,
        website_url: process.env.FRONTEND_URL,
        amount,
        purchase_order_id,
        purchase_order_name: `${plan.name} Membership`,
        customer_info: {
          name: user.name,
          email: user.email,
          phone: user.phone || "9800000001",
        },
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    user.membership = {
      plan: plan._id,
      status: "Pending",
      paymentMethod: "Khalti",
      transactionId: purchase_order_id,
      khaltiPidx: response.data.pidx,
      paymentVerified: false,
      purchasedAt: new Date(),
      startDate: null,
      endDate: null,
    };

    await user.save();
    const savedUser = await User.findById(user._id).lean();
console.log("DB after Khalti init:", savedUser.membership);

    console.log("Saved Khalti pending membership:", {
      userId: user._id,
      transactionId: purchase_order_id,
      khaltiPidx: response.data.pidx,
      plan: plan._id,
    });

    return res.json({
      payment_url: response.data.payment_url,
      pidx: response.data.pidx,
    });
  } catch (error) {
    console.error("Khalti init error:", error?.response?.data || error.message);
    res.status(500).json({
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Payment initialization failed",
    });
  }
};
export const renewMembershipKhalti = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("membership.plan");

    if (!user || !user.membership) {
      return res.status(404).json({ message: "No membership found" });
    }

    if (user.membership.status === "Pending") {
      return res.status(400).json({ message: "Renewal already in progress" });
    }

    if (user.membership.status !== "Expired") {
      return res.status(400).json({
        message: "Membership must be expired to renew",
      });
    }

    const plan = user.membership.plan;

    const purchase_order_id = `RENEW_${Date.now()}_${user._id}`;
    const amount = Number(plan.price) * 100;

    user.membership.status = "Pending";
    user.membership.paymentMethod = "Khalti";
    user.membership.transactionId = purchase_order_id;
    user.membership.paymentVerified = false;
    user.membership.purchasedAt = new Date();

    await user.save();

    const response = await axios.post(
      `${process.env.KHALTI_BASE_URL}/epayment/initiate/`,
      {
        return_url: `${process.env.BACKEND_URL}/api/membership/khalti/success`,
        website_url: process.env.FRONTEND_URL,
        amount,
        purchase_order_id,
        purchase_order_name: "Membership Renewal",
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    res.json({
      payment_url: response.data.payment_url,
      pidx: response.data.pidx,
    });
  } catch (error) {
    console.error("Renew Khalti error:", error);
    res.status(500).json({ message: "Renew failed" });
  }
};

export const khaltiSuccessMembership = async (req, res) => {
  try {
    const { pidx, purchase_order_id } = req.query;

    if (!pidx) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }

    const verification = await axios.post(
      `${process.env.KHALTI_BASE_URL}/epayment/lookup/`,
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = verification.data;

    if (data.status !== "Completed") {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }

    let user = await User.findOne({
      "membership.khaltiPidx": pidx,
    });

    if (!user && data.purchase_order_id) {
      user = await User.findOne({
        "membership.transactionId": data.purchase_order_id,
      });
    }

    if (!user && purchase_order_id) {
      user = await User.findOne({
        "membership.transactionId": purchase_order_id,
      });
    }

    if (!user || !user.membership) {
      console.log("Khalti success: user or membership not found", {
        pidx,
        purchase_order_id,
        lookup_purchase_order_id: data.purchase_order_id,
      });
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }

    const plan = await MembershipPlan.findById(user.membership.plan);

    if (!plan) {
      console.log("Khalti success: plan not found", {
        userId: user._id,
        planId: user.membership.plan,
      });
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }

    const now = new Date();
    const endDate = calculateMembershipEndDate(now, plan.duration);

    user.membership.status = "Active";
    user.membership.paymentVerified = true;
    user.membership.startDate = now;
    user.membership.endDate = endDate;
    user.membership.transactionId = undefined;
    user.membership.khaltiPidx = undefined;

    await user.save();
        console.log("Khalti redirecting to: http://127.0.0.1:5173/plans");
    return res.redirect(`${process.env.FRONTEND_URL}/plans`);
  } catch (error) {
    console.error("Khalti verify error:", error?.response?.data || error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  }
};
export const khaltiCancelMembership = async (req, res) => {
  try {
    const { purchase_order_id } = req.query;

    await User.updateOne(
      {
        "membership.transactionId": purchase_order_id,
        "membership.paymentMethod": "Khalti",
        "membership.status": "Pending",
      },
      {
        $set: {
          "membership.status": "Rejected",
          "membership.transactionId": undefined,
        },
      },
    );

    res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  } catch (err) {
    console.error("Khalti cancel error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  }
};
