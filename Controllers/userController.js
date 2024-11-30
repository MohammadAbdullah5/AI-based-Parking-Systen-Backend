const Vehicle = require('../Models/vehicleModel');
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

let Transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAILER,
      pass: process.env.password,
    },
  });
// Admin signup
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({ email, password: hashedPassword, role: 'admin' });
        await admin.save();
        return res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Admin signin
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user (either admin or owner)
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Determine user role and return appropriate message
        const message =
            user.role === 'admin'
                ? 'Admin signed in successfully'
                : 'Vehicle owner signed in successfully';

        return res.status(200).json({ message, role: user.role });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const addVehicle = async (req, res) => {
    try {
        const { licensePlate, ownerEmail } = req.body;

        // Step 1: Find the user by email
        let user = await User.findOne({ email: ownerEmail });
        const randomPassword = crypto.randomBytes(3).toString('hex');
      
        console.log(randomPassword)
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        // Step 2: If user doesn't exist, create a new user
        if (!user) {
            user = new User({
                email: ownerEmail,
                role: 'owner', // Assuming default role is 'user'
                password: hashedPassword // Set a default password or generate one
            });
            // Send email to user with password
            await user.save();
            await sendEmail({ ownerEmail, licensePlate, randomPassword });
        }

        // Step 3: Create a new vehicle with the userId
        const vehicle = new Vehicle({
            licensePlate,
            ownerEmail,
            userId: user._id // Use the userId from the found/created user
        });
        await vehicle.save();

        return res.status(201).json({ message: 'Vehicle added successfully' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// send email using node mailer
const sendEmail = async ({ ownerEmail, licensePlate, randomPassword }) => {
    try {
  
      
      // Mail options
      const mailOptions = {
        from: process.env.MAILER,
        to: ownerEmail,
        subject: "Vehicle Credentials",
        html: `<h1>Vehicle Added</h1>
              <p>Save these credentials for future reference beacuse you will need them to login</p>
                <p>Your license plate is <b>${licensePlate}</b></p>
              
               <p>Your email is <b>${ownerEmail}</b> and your password is <b>${randomPassword}</b></p>`,
      };
  
      // Send email
      const response = await Transport.sendMail(mailOptions);
      console.log("Message sent: " + response.messageId);
  
      // Return a success message
      return { status: "success", message: "Email sent successfully" };
    } catch (error) {
      console.error("Error sending email:", error);
  
      // Return an error message
      throw new Error("Failed to send email. Please try again.");
    }
  };
// Update vehicle
const updateVehicle = async (req, res) => {
    try {
        const { licensePlate, ownerEmail } = req.body;
        const vehicle = await Vehicle.findOneAndUpdate({ ownerEmail }, { licensePlate }, { new: true });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        return res.status(200).json({ message: 'Vehicle updated successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
    try {
        const { licensePlate } = req.query;
        const vehicle = await Vehicle.findOneAndDelete({ licensePlate });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        return res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// View all vehicles
const viewAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('userId', 'email');;
        return res.status(200).json(vehicles);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// View vehicle details
const viewVehicleDetails = async (req, res) => {
    try {
        const { licensePlate } = req.params;
        const vehicle = await Vehicle.findOne({ licensePlate }).populate('userId', 'email');;
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        return res.status(200).json(vehicle);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const result = await User.findOneAndDelete({role: 'admin'})
        if (!result) return res.status(404).json({ message: 'Admin not found' });
        return res.status(200).json({ message: 'Admin deleted successfully' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

//getCars
const getCars = async (req, res) => {
  try {
    


  } catch (error) {
    return res.status(500).json({ message: error.message });
    
  }
    
};

module.exports = { signup, signin, addVehicle,getCars, updateVehicle, deleteVehicle, viewAllVehicles, viewVehicleDetails, deleteAdmin };
