const { Schema, model, default: mongoose } = require('mongoose');

const userSchema = new Schema({

  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  birthday: { type: String },
  // password nao esta sendo checado.
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  isActive: { type: Boolean, default: true },
  disabledOn: { type: Date },
  dateCreated: { type: Date, default: Date.now },
  proImg: { type: String },
});

const UserModel = model('User', userSchema);

module.exports = UserModel;
