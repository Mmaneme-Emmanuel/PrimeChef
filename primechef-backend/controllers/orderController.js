import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper function for error handling
const handleError = (res, message = "Error", details = null) => {
  console.error(details || message);
  res.status(500).json({ success: false, message });
};

// Helper function to check admin role
const isAdmin = async (userId) => {
  const user = await userModel.findById(userId);
  return user && user.role === "admin";
};

// Place an order
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = new orderModel({ userId, items, amount, address });
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "ngn",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: "ngn",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2000, // $2 delivery charge
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    handleError(res, "Failed to place order", error);
  }
};

// Verify an order
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.status(200).json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(200).json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    handleError(res, "Failed to verify order", error);
  }
};

// Get user orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    handleError(res, "Failed to fetch user orders", error);
  }
};

// List all orders for admin
const listOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (await isAdmin(userId)) {
      const orders = await orderModel.find({});
      res.status(200).json({ success: true, data: orders });
    } else {
      res.status(403).json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    handleError(res, "Failed to list orders", error);
  }
};

// Update order status (admin only)
const updateStatus = async (req, res) => {
  try {
    const { userId, orderId, status } = req.body;

    if (await isAdmin(userId)) {
      await orderModel.findByIdAndUpdate(orderId, { status });
      res.status(200).json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.status(403).json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    handleError(res, "Failed to update order status", error);
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };