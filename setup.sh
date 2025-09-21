#!/bin/bash

echo "🚀 Setting up Ophthalmic Maintenance AI Project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Setup backend
echo "🔧 Setting up backend..."
cd backend
npm install
cd ..

# Setup frontend
echo "🔧 Setting up frontend..."
cd frontend
npm install
cd ..

# Create uploads directory
mkdir -p backend/uploads

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a Supabase project at https://supabase.com/"
echo "2. Copy backend/.env.example to backend/.env and add your keys"
echo "3. Copy frontend/.env.example to frontend/.env.local and add your keys"
echo "4. Run ./deploy.sh dev to start the development servers"
echo ""