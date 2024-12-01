const express = require('express');
const { signup, signin, addVehicle, updateVehicle, deleteVehicle, viewAllVehicles, viewVehicleDetails, deleteAdmin, getCars } = require('../Controllers/userController');
const authorize = require('../authorization')

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/add-vehicle', authorize(['admin']), addVehicle);
router.put('/update-vehicle', authorize(['admin']), updateVehicle);
router.delete('/delete-vehicle', authorize(['admin']), deleteVehicle);
router.get('/view-vehicles', authorize(['admin']), viewAllVehicles);
router.get('/vehicle-details/:licensePlate', authorize(['admin', 'owner']), viewVehicleDetails);
router.delete('/delete-admin', authorize(['admin']), deleteAdmin);
router.post('/getCars', authorize(['owner']), getCars);
module.exports = router;
