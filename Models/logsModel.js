const mongoose = require("mongoose");

const logsSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    arrivalTime: { type: Date, required: true },
    departureTime: { type: Date },
    licensePlate: { type: String },
    isRegistered: { type: Boolean },
  },
  { timestamps: { created_at: "created_at", updated_at: "updated_at" } }
);

module.exports = mongoose.model("Logs", logsSchema);
