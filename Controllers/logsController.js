const FormData = require('form-data');
const fs = require('fs'); 
const Vehicle = require('../Models/vehicleModel');
const multer = require('multer');
const path = require('path');
const Logs = require('../Models/logsModel');
const axios = require('axios');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // You can change this to your desired upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Adding timestamp to filename to avoid conflicts
    },
});
const upload = multer({ storage: storage }).single('video'); // 'video' is the field name used in the form data


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

const processVideoAndLogPlate = async (req, res) => {
    // Upload the video file first
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading video', error: err.message });
        }

        try {
            // Get the path to the uploaded video
            const videoPath = req.file.path;
            // Send the video to the Flask API for processing
            const flaskApiUrl = 'http://127.0.0.1:8000/predict'; // Your Flask API URL

            // Create FormData to send video file to Flask API
            const formData = new FormData();
            formData.append('video', fs.createReadStream(videoPath));

            // Send the video file to Flask API using axios
            const response = await axios.post(flaskApiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Process the response (assuming plates are returned as an array)
            const recognizedPlates = response.data.plates;
            console.log(recognizedPlates)
            // Assuming you want to log the recognized plates and their arrival/departure
            for (let plate of recognizedPlates) {
                const license = plate.plate.toUpperCase()
                // Check if the plate exists in the registered vehicles (this assumes you have a Vehicle model)
                const vehicle = await Vehicle.findOne({ licensePlate: license });

                // Log the vehicle's entry or departure based on the presence of the plate
                if (vehicle) {
                    // Log the vehicle arrival or departure based on your logic
                    const vehicleId = vehicle._id;
                    const arrivalTime = new Date(); // You can change this depending on your logic
                    const logs = new Logs({ vehicleId, arrivalTime, licensePlate: license, isRegistered: true });
                    await logs.save();
                } else {
                    // Log the unregistered vehicle
                    const logs = new Logs({ licensePlate: license, isRegistered: false, arrivalTime: new Date() });
                    await logs.save();
                    console.log(`Unregistered vehicle detected with plate: ${plate}`);
                }
            }

            // Return a success response
            return res.status(200).json({ message: 'Video processed and plates logged successfully', recognizedPlates });

        } catch (error) {
            console.error('Error processing video:', error.message);
            return res.status(500).json({ message: 'Error processing video', error: error.message });
        }
    });
};

const getRegisteredVehicleLogs = async (req, res) => {
    try {
        const logs = await Logs.find({ isRegistered: true }).populate('vehicleId');
        return res.status(200).json(logs);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getUnregisteredVehicleLogs = async (req, res) => {
    try {
        const logs = await Logs.find({ isRegistered: false });
        return res.status(200).json(logs);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { logArrival, logDeparture, getAllVehicleLogs, getVehicleLogs, processVideoAndLogPlate, getRegisteredVehicleLogs, getUnregisteredVehicleLogs };