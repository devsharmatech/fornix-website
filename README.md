# Fornix Medical - Frontend

A modern medical education platform built with React, Redux, and Vite.

## Features

- 🎓 Course Management (NEET UG, NEET PG, AMC, FMGE, PLAB)
- 📝 Interactive Quizzes and Mock Tests
- 📚 Study Materials and Notes
- 💳 Razorpay Payment Integration
- 🔐 User Authentication
- 📊 Progress Tracking
- 🎨 Modern, Responsive UI

## Tech Stack

- **Frontend Framework:** React 18
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Payment:** Razorpay
- **HTTP Client:** Axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd fornix-client
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_SECRET_KEY=your_google_secret
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/              # API configuration
├── Components/       # Reusable components
├── Pages/           # Page components
├── redux/           # Redux store and slices
├── utils/           # Utility functions
└── main.jsx         # Application entry point
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the client-side code.

## Payment Integration

This project uses Razorpay for payment processing. The payment flow is handled entirely on the frontend for development purposes.

**⚠️ Note:** For production, implement proper backend verification for security.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
