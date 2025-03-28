import mongoose from "mongoose";
import Order from "../models/Order.js";
import { sendOrderEmails } from "../services/emailService.js";

export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession(); // Start a transaction session
  session.startTransaction();

  try {
    const { firstName, email, address, phone, deliveryDate, deliveryType } = req.body.customer;
    const { cart, totalPrice } = req.body;

    // Rename variables for consistency
    const customerName = firstName;
    const customerEmail = email;
    const customerAddress = address;
    const customerPhone = phone;

    console.log("Req Body: ", req.body);

    // Create new order in MongoDB with transaction
    const newOrder = new Order({
      customer: {
        firstName: customerName,
        email: customerEmail,
        address: customerAddress,
        phone: customerPhone,
        deliveryDate: deliveryDate,
        deliveryType: deliveryType,
      },
      cart,
      totalPrice,
    });

    // Save order in database
    const savedOrder = await newOrder.save({ session });

    // Send confirmation emails (if this fails, rollback)
    await sendOrderEmails({
      orderId: savedOrder._id,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      deliveryDate,
      deliveryType,
      cart,
      totalPrice,
    });

    // Commit transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Order placed successfully!", order: savedOrder });

  } catch (error) {
    console.error("Error placing order:", error);

    // Rollback transaction if something goes wrong
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ error: "Order placement failed" });
  }
};
