# Capture & Create - Photography Portfolio Website

A modern, responsive photography portfolio and booking platform built with React and Supabase. This platform enables photographers to showcase their work, manage client bookings, and provide a seamless experience for clients through an integrated portal.

## Features

- **Portfolio Gallery** - Showcase photography work with beautiful, responsive galleries
- **Service Pages** - Detailed information about photography services offered
- **Booking System** - Integrated booking functionality for photography sessions
- **Client Portal** - Secure area for clients to view and manage their photos
- **Admin Dashboard** - Comprehensive dashboard for managing bookings, galleries, and content
- **Authentication** - Secure login and user management powered by Supabase
- **Responsive Design** - Optimized for all devices and screen sizes
- **Dark/Light Mode** - Theme switching support for user preference
- **Contact Forms** - Easy client communication and inquiry management

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite 5** - Fast build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible component primitives

### Backend & Services
- **Supabase** - Backend as a Service (BaaS)
  - Authentication
  - PostgreSQL Database
  - Real-time subscriptions
  - File storage

### State Management & Data Fetching
- **TanStack Query (React Query)** - Powerful data fetching and caching
- **React Context API** - Global state management

### Form Handling
- **React Hook Form** - Performant form management
- **Zod** - TypeScript-first schema validation

### UI Components & Features
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization
- **React Dropzone** - File upload functionality
- **Embla Carousel** - Smooth carousel/slider
- **Sonner** - Toast notifications
- **date-fns** - Date manipulation

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/VeroC12-hub/capture-create.git
cd capture-create
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=your_supabase_url
```

**Note:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080/`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
capture-create/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components (route views)
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # Third-party integrations (Supabase)
│   ├── lib/              # Utility functions and helpers
│   ├── assets/           # Static assets (images, fonts)
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Public static files
├── .env                  # Environment variables (not in repo)
├── package.json          # Project dependencies
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Routes

The application includes the following routes:

- `/` - Homepage
- `/services` - Services overview
- `/services/:serviceType` - Individual service details
- `/portfolio` - Portfolio gallery
- `/about` - About page
- `/contact` - Contact page
- `/booking` - Booking system
- `/client-portal` - Client portal (protected)
- `/login` - Authentication page
- `/admin` - Admin dashboard (protected)
- `/gallery/:galleryId` - Individual gallery view

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Configure environment variables in Netlify dashboard
6. Deploy!

### Deploy via Lovable

You can also deploy directly through Lovable:
1. Open your project in [Lovable](https://lovable.dev)
2. Click Share → Publish
3. Your site will be live!

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable API key | Yes |
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |

## Development Workflow

### Using Lovable (Visual Development)

This project was created with [Lovable](https://lovable.dev), which allows you to:
- Build and edit visually through prompts
- See changes in real-time
- Automatically sync with GitHub

Changes made in Lovable are automatically committed to this repository.

### Using Your IDE

You can also develop locally with your preferred IDE:
1. Make changes to the code
2. Test locally with `npm run dev`
3. Commit and push changes to GitHub
4. Changes will sync with Lovable

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- Never commit `.env` files or sensitive credentials
- All API keys should be stored in environment variables
- Supabase RLS (Row Level Security) policies should be configured
- Regular dependency updates recommended

## Support

For support, please:
- Open an issue on GitHub
- Contact through the website contact form
- Email: [your-email@example.com]

## License

This project is private and proprietary.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ for photographers**
