const Vehicle = require('../Models/vehicleModel');

const Logs = require('../Models/logsModel');

// Log vehicle arrival
const logArrival = async (req, res) => {
    try {
        const { vehicleId } = req.body;
        const arrivalTime = new Date();
        const logs = new Logs({ vehicleId, arrivalTime });
        await logs.save();
        return res.status(200).json({ message: 'Vehicle arrival logged successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Log vehicle departure
const logDeparture = async (req, res) => {
    try {
        const { vehicleId } = req.body;
        const logs = await Logs.findOne({ vehicleId, departureTime: null });
        if (!logs) return res.status(404).json({ message: 'Vehicle not found' });
        logs.departureTime = new Date();
        await logs.save();
        return res.status(200).json({ message: 'Vehicle departure logged successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getAllVehicleLogs = async (req, res) => {
    try {
        const logs = await Logs.find().populate('vehicleId');
        return res.status(200).json(logs);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getVehicleLogs = async (req, res) => {
    try {
        const { licensePlate } = req.params;
        const logs = await Logs.find({ vehicleId: licensePlate }).populate('vehicleId');
        return res.status(200).json(logs);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { logArrival, logDeparture, getAllVehicleLogs, getVehicleLogs };