# PrivacyGuard

A comprehensive personal data privacy protection platform that helps users take control of their online privacy by scanning data broker websites for personal information exposure and automating the removal process.

## Features

- **Privacy Scanning**: Scan 420+ data broker websites to find where your personal information is exposed
- **Privacy Score**: Get a comprehensive privacy score based on your data exposure level
- **Automated Removal Requests**: Generate personalized opt-out forms and track removal progress
- **Exposure Tracking**: Detailed reports showing exactly what information is exposed and where
- **Removal Progress Monitoring**: Track the status of all your removal requests in one place
- **Educational Resources**: Learn about digital privacy and data broker practices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with secure cookies

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/privacyguard.git
cd privacyguard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
```

4. Push the database schema:
```bash
npm run db:push
```

5. Seed the data brokers database:
```bash
npx tsx server/seed.ts
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Page components
├── server/                 # Express backend
│   ├── services/          # Business logic services
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── seed.ts            # Database seeding
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Drizzle ORM schema
└── package.json
```

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `GET /api/users/by-email/:email` - Get user by email (protected)

### Scans
- `POST /api/scans` - Initiate a privacy scan (protected)
- `GET /api/users/:userId/latest-scan` - Get latest scan for user (protected)
- `GET /api/scans/:id/results` - Get scan results and exposures (protected)

### Removal
- `POST /api/scans/:id/remove` - Initiate removal process (protected)
- `GET /api/scans/:id/removal-progress` - Get removal progress (protected)
- `GET /api/exposures/:id/removal-form` - Generate personalized removal form (protected)

### Data Brokers
- `GET /api/data-brokers` - Get all data brokers (public)

## Security

- All endpoints exposing personal information are protected with session-based authentication
- Ownership verification ensures users can only access their own data
- Secure session cookies with httpOnly and SameSite attributes
- No sensitive data is logged or exposed in error messages

## Data Broker Categories

PrivacyGuard tracks data brokers across multiple categories:
- **People Search**: Sites that aggregate public records and create profiles
- **Marketing**: Companies that collect data for targeted advertising
- **Credit**: Credit bureaus and financial data aggregators
- **Public Records**: Government and court record aggregators

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Replit](https://replit.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
