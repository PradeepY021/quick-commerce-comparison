#!/bin/bash

# QuickCommerce Compare - Startup Script
echo "🚀 Starting QuickCommerce Compare..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: brew services start mongodb-community"
    echo "   Or install MongoDB and start the service."
fi

# Check if Redis is running
if ! pgrep -x "redis-server" > /dev/null; then
    echo "⚠️  Redis is not running. Please start Redis first."
    echo "   You can start it with: brew services start redis"
    echo "   Or install Redis and start the service."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client
    npm install
    cd ..
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ Please edit .env file with your configuration"
fi

# Start the application
echo "🎯 Starting the application..."

# Start backend in background
echo "🔧 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend development server..."
cd client
npm start &
FRONTEND_PID=$!

# Function to handle cleanup on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "✅ QuickCommerce Compare is running!"
echo "🌐 Backend: http://localhost:3000"
echo "🎨 Frontend: http://localhost:3001"
echo "📊 Health Check: http://localhost:3000/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes
wait
