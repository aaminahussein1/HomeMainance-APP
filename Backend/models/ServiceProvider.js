const mongoose = require("mongoose");

const ServiceProviderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    serviceType: { type: String, required: true },

    profileImage: { type: String },
    documents: [{ type: String }],

    availability: { type: Boolean, default: true },

    status: {
      type: String,
      enum: ["pending", "approved", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceProvider", ServiceProviderSchema);
