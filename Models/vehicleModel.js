const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    licensePlate: { type: String, unique: true, required: true },
    ownerEmail: { type: String, required: true }},
    { timestamps: { created_at: "created_at", updated_at: "updated_at" } }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
