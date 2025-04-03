# Photography Portfolio Backend

This is a simple Node.js backend server for handling contact form submissions from Cameron's photography portfolio website.

## Features

- Express.js server with API endpoints
- Nodemailer integration for sending emails
- CORS support for cross-origin requests
- Environment variable configuration

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gmail account (for sending emails)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Configuration

1. Create a `.env` file in the root directory (or rename the `.env.example` file)
2. Add the following environment variables:

```
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Important Note about EMAIL_PASS:**
For Gmail, you need to use an "App Password" instead of your regular password:

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. Scroll down and click on "App passwords"
4. Select "Mail" and "Other" (custom name)
5. Enter a name (e.g., "Portfolio Contact Form")
6. Click "Generate"
7. Use the generated 16-character password in your .env file

### Running the Server

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### POST /api/contact

Handles contact form submissions.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Photography Inquiry",
  "message": "Hello, I'm interested in booking a session..."
}
```

**Response:**

Success (200):
```json
{
  "success": true,
  "message": "Your message has been sent successfully!"
}
```

Error (400/500):
```json
{
  "success": false,
  "message": "Error message here"
}
```

### GET /api/test

Simple endpoint to test if the server is running.

**Response:**

```json
{
  "message": "Backend server is running!"
}
```

## Deployment

For production deployment, consider using services like:

- Heroku
- Vercel
- DigitalOcean
- AWS

Remember to update the frontend API URL to point to your deployed backend URL instead of localhost. 