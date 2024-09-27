// Import required packages
const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all origins
app.use(cors()); // Add this line to enable CORS

// Test route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS, // Your email password
    },
});

// Email sending endpoint
app.post('/send-email', (req, res) => {
    const { email, location, temperature, humidity, windSpeed } = req.body;
  
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Weather Report for ${location}`,
      text: `The temperature in ${location} is ${temperature}°C with ${humidity}% humidity and wind speed of ${windSpeed} Km/h.`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email: ' + error.toString() });
      }
      // Change this line to remove SMTP details from the response
      res.status(200).json({ message: 'Email sent successfully!' }); 
    });
  });
  
  


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
