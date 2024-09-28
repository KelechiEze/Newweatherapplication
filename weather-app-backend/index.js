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

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your React app's URL
}));

// Test route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS, // Your email password or app password
    },
});

// Function to generate email HTML content
const generateEmailHTML = (data) => {
    return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #4CAF50; /* Green */
          }
          h2 {
            color: #333;
          }
          .weather-icon {
            width: 100px;
          }
          .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Weather Report for ${data.location}</h1>
          <img src="${data.icon}" alt="Weather Icon" class="weather-icon" />
          <h2>Current Temperature: ${data.temperature}°C</h2>
          <p>Humidity: ${data.humidity}%</p>
          <p>Wind Speed: ${data.windSpeed} Km/h</p>
          <div class="footer">
            <p>Thank you for using kelechi Eze's weather service!</p>
            <p>Stay safe and have a great day!</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Email sending endpoint
app.post('/send-email', (req, res) => {
    const { email, location, temperature, humidity, windSpeed, icon } = req.body;

    // Validate required fields
    if (!email || !location || temperature == null || humidity == null || windSpeed == null || !icon) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    const htmlContent = generateEmailHTML({
        location,
        temperature,
        humidity,
        windSpeed,
        icon,
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: `Weather Report for ${location}`,
        html: htmlContent, // Use the HTML content here
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email: ' + error.toString() });
        }
        res.status(200).json({ message: 'Email sent successfully!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
