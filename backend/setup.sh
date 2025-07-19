#!/bin/bash

# Setup script for TCC Redis Environment
echo "🚀 Setting up TCC Redis Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    
    # Generate random Redis password
    REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    # Update Redis password in .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your_redis_password/$REDIS_PASSWORD/g" .env
    else
        # Linux
        sed -i "s/your_redis_password/$REDIS_PASSWORD/g" .env
    fi
    
    echo "✅ .env file created with generated Redis password"
else
    echo "ℹ️  .env file already exists"
fi

# Update Redis configuration with the same password
if [ -f .env ]; then
    REDIS_PASSWORD=$(grep REDIS_PASSWORD .env | cut -d '=' -f2)
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your_redis_password/$REDIS_PASSWORD/g" redis/redis.conf
    else
        # Linux
        sed -i "s/your_redis_password/$REDIS_PASSWORD/g" redis/redis.conf
    fi
    
    echo "✅ Redis configuration updated with password from .env"
fi

# Build and start Docker containers
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
sleep 5

# Test Redis connection
echo "🔍 Testing Redis connection..."
REDIS_PASSWORD=$(grep REDIS_PASSWORD .env | cut -d '=' -f2)

if docker exec tcc-redis redis-cli -a "$REDIS_PASSWORD" ping | grep -q PONG; then
    echo "✅ Redis is running and accessible"
else
    echo "❌ Redis connection failed"
    exit 1
fi

# Install Node.js dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
else
    echo "ℹ️  Node.js dependencies already installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📊 Services running:"
echo "   - Redis: localhost:6379"
echo "   - Redis Commander: http://localhost:8081"
echo ""
echo "🔧 To start the development server:"
echo "   npm run dev"
echo ""
echo "🛑 To stop all services:"
echo "   docker-compose down"
echo ""
echo "📚 API Endpoints:"
echo "   - Session Management: http://localhost:3000/api/sessions"
echo "   - Chat with Sessions: http://localhost:3000/api/chat/session"
echo "   - Health Check: http://localhost:3000/health"
