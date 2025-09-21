#!/bin/bash

COMMAND=${1:-"dev"}

case $COMMAND in
  "dev")
    echo "🚀 Starting development servers..."
    
    # Start backend in background
    echo "🔧 Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    echo "🔧 Starting frontend server..."
    cd frontend
    npm run dev
    
    # Kill backend when frontend exits
    kill $BACKEND_PID
    ;;
    
  "build")
    echo "🔨 Building production packages..."
    
    # Build backend
    echo "🔧 Building backend..."
    cd backend
    npm run build
    cd ..
    
    # Build frontend
    echo "🔧 Building frontend..."
    cd frontend
    npm run build
    cd ..
    
    echo "✅ Build complete!"
    ;;
    
  "prod")
    echo "🚀 Starting production servers..."
    
    # Start backend in background
    echo "🔧 Starting backend server..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    echo "🔧 Starting frontend server..."
    cd frontend
    npm start
    
    # Kill backend when frontend exits
    kill $BACKEND_PID
    ;;
    
  *)
    echo "Usage: ./deploy.sh [dev|build|prod]"
    echo "  dev   - Start development servers"
    echo "  build - Build production packages"
    echo "  prod  - Start production servers"
    ;;
esac