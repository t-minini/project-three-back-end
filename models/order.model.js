const { Schema, model, default: mongoose } = require("mongoose");

const orderSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  trips: [
    {
      trip: { type: mongoose.Types.ObjectId, ref: "Trip" },
      quantity: { type: String, required: true },
      unitPrice: { type: String, required: true },
    },
  ],

  orderTotal: { type: String, required: true },
  status: { type: String },
  dateCreated: { type: Date, default: Date.now },
});

const OrderModel = model("Order", orderSchema);

module.exports = OrderModel;
