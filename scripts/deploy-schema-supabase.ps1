# PowerShell script to deploy Prisma schema to Supabase
# This uses the direct connection (port 5432) for schema operations

Write-Host "🚀 Deploying Prisma schema to Supabase..." -ForegroundColor Cyan
Write-Host ""

# Read Supabase URL from .env
$supabaseUrl = (Get-Content .env | Select-String "SUPABASE_DATABASE_URL").ToString().Split('=')[1].Trim('"').Trim("'")

# Convert pooler URL to direct connection URL
# Replace pooler port (6543) with direct port (5432)
# Remove pgbouncer parameter
$directUrl = $supabaseUrl -replace ':6543', ':5432' -replace '\?pgbouncer=true', '?sslmode=require' -replace '\?pgbouncer=true&', '?' -replace '&pgbouncer=true', ''

# If no sslmode, add it
if ($directUrl -notmatch 'sslmode') {
    if ($directUrl -match '\?') {
        $directUrl = $directUrl + '&sslmode=require'
    } else {
        $directUrl = $directUrl + '?sslmode=require'
    }
}

Write-Host "📡 Using direct connection (port 5432) for schema deployment" -ForegroundColor Yellow
Write-Host ""

# Set DATABASE_URL temporarily
$env:DATABASE_URL = $directUrl

# Deploy schema
Write-Host "📤 Pushing schema to Supabase..." -ForegroundColor Cyan
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Schema deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Generating Prisma Client..." -ForegroundColor Cyan
    npx prisma generate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Prisma Client generated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Schema deployment complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next step: Run 'npm run migrate:to-supabase' to migrate your data" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "❌ Schema deployment failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Tip: Make sure you have the direct connection string (port 5432)" -ForegroundColor Yellow
    Write-Host "   Get it from Supabase Dashboard → Settings → Database → Connection string → Direct connection" -ForegroundColor Yellow
}





