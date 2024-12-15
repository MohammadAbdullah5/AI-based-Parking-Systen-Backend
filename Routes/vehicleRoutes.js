const express = require('express');
const { logArrival, logDeparture, getAllVehicleLogs, getVehicleLogs, processVideoAndLogPlate, getRegisteredVehicleLogs, getUnregisteredVehicleLogs } = require('../Controllers/logsController');
const authorize = require('../authorization');
const router = express.Router();

router.post('/departure', logDeparture);
router.post('/arrival', logArrival);
router.get('/all-logs', authorize(['admin']), getAllVehicleLogs);
router.get('/registered-logs', authorize(['admin']), getRegisteredVehicleLogs);
router.get('/unregistered-logs', authorize(['admin']), getUnregisteredVehicleLogs);
router.get('/logs/:licensePlate', authorize(['admin', 'owner']), getVehicleLogs);
router.post('/upload-video', processVideoAndLogPlate);
module.exports = router;