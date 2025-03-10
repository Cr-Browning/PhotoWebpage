const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Import routes
const instagramRoutes = require('./src/routes/instagramRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true, // Show debug output
  logger: true // Log information about the mail transport
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// API endpoint for contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  try {
    console.log('Attempting to send email with the following configuration:');
    console.log('From:', `"${name}" <${email}>`);
    console.log('To:', 'cameronwgiglio@gmail.com');
    console.log('Subject:', `Portfolio Contact: ${subject}`);
    
    // Email options
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: 'cameronwgiglio@gmail.com',
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New message from your portfolio website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    // Send email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully!');
      res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send message. Please try again later.',
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('General error in contact endpoint:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.',
      error: error.message
    });
  }
});

// Register routes
app.use('/api/instagram', instagramRoutes);

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 