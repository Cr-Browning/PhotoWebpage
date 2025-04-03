# Photography Portfolio Website

A modern, responsive photography portfolio website built with React, TypeScript, and Node.js. This full-stack application showcases photography work with a clean, professional design and Instagram integration.

## Features

- Responsive design that works on all devices
- Instagram integration to display your latest photos
- Modern UI with smooth animations
- TypeScript for type safety and better development experience
- Backend API for Instagram data fetching
- Easy to customize and extend

## Prerequisites

- Node.js v16.20.2 (LTS)
- npm (comes with Node.js)
- Instagram API credentials (see INSTAGRAM_SETUP.md)


## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd PhotoWebpage
```

2. Install frontend dependencies:
```bash
cd frontend
npm install --legacy-peer-deps
```

3. Install backend dependencies:
```bash
cd ../photography-portfolio-backend
npm install
```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Add your Instagram API credentials

## Running the Application

1. Start the backend server:
```bash
cd photography-portfolio-backend
npm start
```

2. Start the frontend development server:
```bash
cd ../frontend
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Building for Production

To create a production build:

```bash
cd frontend
npm run build
```

The build artifacts will be stored in the `frontend/build/` directory.

## Backend API

The backend provides the following endpoints:
- `/api/instagram/media` - Fetches Instagram media
- `/api/instagram/profile` - Fetches Instagram profile information

See `INSTAGRAM_SETUP.md` for detailed setup instructions.

## Customization

- Update Instagram API credentials in backend `.env` file
- Modify frontend styles in `src/styles/`
- Update content in respective component files

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - CSS Modules
- Backend:
  - Node.js
  - Express
  - Instagram Graph API