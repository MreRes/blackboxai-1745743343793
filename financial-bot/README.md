# WhatsApp Financial Management Bot

A comprehensive financial management system with WhatsApp bot integration for tracking expenses, managing budgets, and generating financial reports.

## Features

### WhatsApp Bot
- Natural Language Processing (NLP) for understanding informal messages
- Automatic transaction recording
- Budget tracking and alerts
- Financial report generation
- Multi-language support (Indonesian & English)

### Web Dashboard
- Real-time financial overview
- Transaction management
- Budget planning and tracking
- Detailed financial reports and analytics
- WhatsApp session management

### Key Functionalities
- User registration and activation system
- Secure authentication
- Transaction tracking and categorization
- Budget management
- Financial reporting
- WhatsApp integration
- Multi-device support

## Tech Stack

### Backend
- Node.js + Express
- MongoDB (Database)
- JWT Authentication
- WhatsApp Web API
- Natural Language Processing

### Frontend
- React
- Tailwind CSS
- Chart.js
- React Query
- React Router

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- WhatsApp account for bot integration

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd financial-bot
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
```bash
# Backend (.env)
PORT=3000
MONGODB_URI=mongodb://localhost:27017/financial_bot
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
WHATSAPP_SESSION_DIR=./whatsapp-sessions
```

5. Start the development servers
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## Usage

### User Registration
1. Register through the web interface
2. Receive activation code
3. Activate account through WhatsApp or web interface

### WhatsApp Integration
1. Scan QR code from web dashboard
2. Start sending financial transactions
3. Use natural language to record transactions

### Transaction Recording
- Web Interface: Use the dashboard to manually record transactions
- WhatsApp: Send messages in natural language
  Examples:
  - "bayar makan 50000"
  - "terima gaji 5000000"
  - "beli bensin 100000"

### Budget Management
- Set monthly budgets per category
- Receive alerts when nearing budget limits
- Track spending patterns

### Financial Reports
- View daily, monthly, and yearly reports
- Analyze spending patterns
- Export reports in various formats

## Security Features
- JWT Authentication
- Password Hashing
- Rate Limiting
- Session Management
- Input Validation
- XSS Protection

## Contributing
Contributions are welcome! Please read our contributing guidelines for details.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
