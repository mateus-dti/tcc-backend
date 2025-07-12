# Setup script for TCC Redis Environment (PowerShell)
Write-Host "🚀 Setting up TCC Redis Environment..." -ForegroundColor Green

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "✅ Docker found" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose found" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    
    # Generate random Redis password
    $REDIS_PASSWORD = -join ((1..25) | ForEach {[char]((65..90) + (97..122) + (48..57) | Get-Random)})
    
    # Update Redis password in .env
    $envContent = Get-Content .env
    $envContent = $envContent -replace 'your_redis_password', $REDIS_PASSWORD
    Set-Content .env $envContent
    
    Write-Host "✅ .env file created with generated Redis password" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .env file already exists" -ForegroundColor Blue
}

# Update Redis configuration with the same password
if (Test-Path .env) {
    $REDIS_PASSWORD = (Get-Content .env | Where-Object {$_ -match "REDIS_PASSWORD="} | ForEach-Object {$_.Split('=')[1]})
    
    $redisConfContent = Get-Content redis/redis.conf
    $redisConfContent = $redisConfContent -replace 'your_redis_password', $REDIS_PASSWORD
    Set-Content redis/redis.conf $redisConfContent
    
    Write-Host "✅ Redis configuration updated with password from .env" -ForegroundColor Green
}

# Build and start Docker containers
Write-Host "🐳 Starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d

# Wait for Redis to be ready
Write-Host "⏳ Waiting for Redis to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test Redis connection
Write-Host "🔍 Testing Redis connection..." -ForegroundColor Yellow
$REDIS_PASSWORD = (Get-Content .env | Where-Object {$_ -match "REDIS_PASSWORD="} | ForEach-Object {$_.Split('=')[1]})

try {
    $testResult = docker exec tcc-redis redis-cli -a "$REDIS_PASSWORD" ping
    if ($testResult -eq "PONG") {
        Write-Host "✅ Redis is running and accessible" -ForegroundColor Green
    } else {
        throw "Redis ping failed"
    }
} catch {
    Write-Host "❌ Redis connection failed" -ForegroundColor Red
    exit 1
}

# Install Node.js dependencies if not already installed
if (-not (Test-Path node_modules)) {
    Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "ℹ️  Node.js dependencies already installed" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Services running:" -ForegroundColor Cyan
Write-Host "   - Redis: localhost:6379" -ForegroundColor White
Write-Host "   - Redis Commander: http://localhost:8081" -ForegroundColor White
Write-Host ""
Write-Host "🔧 To start the development server:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop all services:" -ForegroundColor Cyan
Write-Host "   docker-compose down" -ForegroundColor White
Write-Host ""
Write-Host "📚 API Endpoints:" -ForegroundColor Cyan
Write-Host "   - Session Management: http://localhost:3000/api/sessions" -ForegroundColor White
Write-Host "   - Chat with Sessions: http://localhost:3000/api/chat/session" -ForegroundColor White
Write-Host "   - Health Check: http://localhost:3000/health" -ForegroundColor White
