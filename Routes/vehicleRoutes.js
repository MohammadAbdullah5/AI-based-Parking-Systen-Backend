const express = require('express');
const { logArrival, logDeparture, getAllVehicleLogs, getVehicleLogs } = require('../Controllers/logsController');
const authorize = require('../authorization');
const router = express.Router();

router.post('/departure', logDeparture);
router.post('/arrival', logArrival);
router.get('/all-logs', authorize(['admin']), getAllVehicleLogs);
router.get('/logs/:licensePlate', authorize(['admin', 'owner']), getVehicleLogs);

module.exports = router;