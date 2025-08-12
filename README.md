# NoMoreNoise - Community Noise Mapping Platform

A modern web application for reporting and tracking noise pollution in communities. Built to help citizens document environmental noise issues and work together towards quieter neighborhoods.

## 🚀 Features

- **Real-time Noise Reporting**: Submit detailed noise complaints with location data
- **Interactive Dashboard**: View and manage noise reports in your area
- **Admin Panel**: Administrative tools for monitoring and managing reports
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **User Authentication**: Secure login system with demo access

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn-ui components
- **Build Tool**: Vite
- **Backend**: Supabase (Database + Authentication)
- **Maps**: Custom mapping solution
- **State Management**: React Query

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd nomorenoise

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Demo

Try the application with these demo credentials:
- **Email**: demo@nomorenoise.app
- **Password**: Demo123!

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages/routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── utils/              # Helper utilities
```

## 🎨 Design System

The application uses a custom design system built with:
- Tailwind CSS for utility-first styling
- shadcn-ui for consistent component patterns
- Custom CSS variables for theming
- Responsive design principles

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables for Supabase integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions or support, please contact the development team.