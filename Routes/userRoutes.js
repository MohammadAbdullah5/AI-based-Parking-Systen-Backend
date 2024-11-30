const express = require('express');
const router = express.Router();
const { signup, signin,getCars, addVehicle, updateVehicle, deleteVehicle, viewAllVehicles, viewVehicleDetails, deleteAdmin } = require('../Controllers/userController');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/add-vehicle', addVehicle);
router.put('/update-vehicle', updateVehicle);
router.delete('/delete-vehicle', deleteVehicle);
router.get('/view-vehicles', viewAllVehicles);
router.get('/vehicle-details/:licensePlate', viewVehicleDetails);
router.delete('/delete-admin', deleteAdmin);
router.post('getCars', getCars);

module.exports = router;
