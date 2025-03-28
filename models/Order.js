import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    firstName: String,
    email: String,
    address: String,
    phone: String,
    deliveryDate: {
      type: Date,
      set: (v) => v.toISOString().split('T')[0], 
    },
    deliveryType: String
  },
  cart: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
