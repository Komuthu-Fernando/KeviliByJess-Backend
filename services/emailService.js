import dotenv from "dotenv";
import emailjs, { EmailJSResponseStatus } from "@emailjs/nodejs";

dotenv.config();

export const sendOrderEmails = async (orderDetails) => {
  const {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    deliveryDate,
    cart,
    totalPrice,
  } = orderDetails;

  // Format cart items into a readable string
  const formattedCart = cart.map((item) => `${item.quantity} x ${item.name} - $${item.price}`).join("\n");

  // Template parameters for Customer Email
  const customerTemplateParams = {
    to_email: customerEmail,
    orderId,
    customerName,
    deliveryDate,
    cart: formattedCart,
    totalPrice,
    logoUrl: "https://yourdomain.com/path-to-your-logo.png",
  };

  // Template parameters for Client Email
  const clientTemplateParams = {
    to_email: process.env.CLIENT_EMAIL,
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    deliveryDate,
    cart: formattedCart,
    totalPrice,
    logoUrl: "https://yourdomain.com/path-to-your-logo.png",
  };

  try {
    // Send email to Customer
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_CUSTOMER_TEMPLATE_ID,
      customerTemplateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY, 
        privateKey: process.env.EMAILJS_PRIVATE_KEY, 
      }
    );
    console.log("Customer email sent successfully!");

    // Send email to Client
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_CLIENT_TEMPLATE_ID,
      clientTemplateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY, 
        privateKey: process.env.EMAILJS_PRIVATE_KEY, 
      }
    );
    console.log("Client email sent successfully!");
  } catch (error) {
    if (error instanceof EmailJSResponseStatus) {
      console.log("EmailJS Error:", error);
      return;
    }
    console.error("Unexpected Error:", error);
  }
};
