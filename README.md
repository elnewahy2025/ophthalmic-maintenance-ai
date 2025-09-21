# Ophthalmic Device Maintenance AI

A web application that helps ophthalmic device technicians get AI-generated step-by-step maintenance solutions based on uploaded device manuals.

## 🚀 Features

- **Technician Portal**: Submit device problems and get AI solutions
- **Admin Portal**: Upload and manage PDF manuals
- **AI-Powered Solutions**: Step-by-step guidance with source citations
- **Role-Based Access**: Secure admin/technician access control
- **History Tracking**: View past solutions and queries
- **PDF Processing**: Automatic handling of large PDF files

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase (PostgreSQL with RLS)
- **AI**: OpenAI GPT-4
- **Authentication**: Supabase Auth
- **PDF Processing**: pdf-parse, pdf-lib
- **Deployment**: Docker, Vercel, Railway

## 📋 Prerequisites

- Node.js v18+
- Docker (optional, for containerized deployment)
- Supabase account
- OpenAI API key

## 🚀 Quick Start

1. Clone the repository
2. Set up Supabase project
3. Configure environment variables
4. Run setup script: `./setup.sh`
5. Start development: `./deploy.sh dev`

## 📖 Documentation

- [API Documentation](documentation/API_DOCUMENTATION.md)
- [Deployment Guide](documentation/DEPLOYMENT_GUIDE.md)
- [User Manual](documentation/USER_MANUAL.md)
- [Troubleshooting](documentation/TROUBLESHOOTING.md)

## 📄 License

MIT License