const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config(); 


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.STORE_EMAIL,
    pass: process.env.STORE_EMAIL_PASS,
  },
});


const sendOrderEmail = async(recipient,orderDetails) => {
    try{
        const info = await transporter.sendMail({
            from:`"Shopify Store 2" <${process.env.STORE_EMAIL}>`,
            to:recipient,
            subject:`Order Confirmation`,
            text: `Thank you for your order! Details:\n${orderDetails}`,
            html: `<p>Thank you for your order!</p><pre>${orderDetails}</pre>`
        })

        console.log(`What transporter returns : `,info);
        console.log("Email sent: %s", info.messageId);
        return info.messageId;

    }catch(e){
        console.error("Failed to send email:", e);
        
    }
}


const orderWebhookHandler = async (req, res) => {
    try {
      console.log("hi there");
      console.log("Webhook received:", req.body);
    
      
      const { email, order_number, line_items } = req.body; 
      if (!email || !order_number || !line_items) {
        return res.status(400).json({ error: "Missing required fields in webhook payload" });
      }
  
      
      const orderDetails = `Order Number: ${order_number}\nItems:\n${line_items
        .map(item => `- ${item.name} x ${item.quantity}`)
        .join("\n")}`;
  
      
      const emailId = await sendOrderEmail(email, orderDetails);
  
      
      return res.status(200).json({ message: "Webhook handled and email sent", emailId });
    } catch (error) {
      console.error("Error handling webhook:", error);
      res.status(500).json({ error: "Webhook handling failed" });
    }
  };

module.exports = { orderWebhookHandler };
