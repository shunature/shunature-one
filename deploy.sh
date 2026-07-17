#!/bin/bash

# shunature.one Unified Deployment & Setup Script
# Works on macOS and Linux (Ubuntu/Debian)

set -e

# Color Codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}   shunature.one Portfolio & CMS Migration Script     ${NC}"
echo -e "${GREEN}======================================================${NC}"

# 1. Prerequisite Checks
echo -e "\n${YELLOW}[1/6] Checking prerequisites...${NC}"

check_cmd() {
  if ! command -v "$1" &> /dev/null; then
    echo -e "${RED}Error: $1 is not installed. Please install it before proceeding.${NC}"
    exit 1
  else
    echo -e "  - $1: found"
  fi
}

check_cmd "ruby"
check_cmd "bundle"
check_cmd "node"
check_cmd "npm"
check_cmd "psql"

# 2. Dependency Installation
echo -e "\n${YELLOW}[2/6] Installing dependencies...${NC}"

echo "Installing frontend npm packages..."
npm install

echo "Installing CMS API Ruby gems..."
cd cms
bundle install
cd ..

# 3. Environment Config Setup
echo -e "\n${YELLOW}[3/6] Configuring environment variables...${NC}"

# Ask for DB credentials
read -p "Enter PostgreSQL username [postgres]: " PG_USER
PG_USER=${PG_USER:-postgres}

read -p "Enter PostgreSQL password []: " -s PG_PASS
echo ""

read -p "Enter PostgreSQL host [localhost]: " PG_HOST
PG_HOST=${PG_HOST:-localhost}

# Create / Update cms config/database.yml or .env
echo "Creating/Updating database configurations..."
cat << EOF > cms/config/database.yml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: ${PG_USER}
  password: "${PG_PASS}"
  host: ${PG_HOST}

development:
  <<: *default
  database: cms_development

test:
  <<: *default
  database: cms_test

production:
  primary:
    <<: *default
    database: cms_production
  cache:
    <<: *default
    database: cms_production_cache
    migrations_paths: db/cache_migrate
  queue:
    <<: *default
    database: cms_production_queue
    migrations_paths: db/queue_migrate
  cable:
    <<: *default
    database: cms_production_cable
    migrations_paths: db/cable_migrate
EOF

# Create Auth Database URL in .env
echo "Creating .env for Prisma authentication database..."
cat << EOF > .env
DATABASE_URL="postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}:5432/shunature_auth"
EOF

# Create .env.local if not exist
if [ ! -f .env.local ]; then
  echo "Generating VAPID keys for push notifications..."
  VAPID_KEYS=$(npx web-push generate-vapid-keys --json)
  VAPID_PUBLIC=$(echo $VAPID_KEYS | node -e "const fs = require('fs'); console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')).publicKey)")
  VAPID_PRIVATE=$(echo $VAPID_KEYS | node -e "const fs = require('fs'); console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')).privateKey)")
  
  echo "Generating AUTH_SECRET for NextAuth..."
  AUTH_SECRET=$(openssl rand -hex 32)

  echo "Creating .env.local..."
  cat << EOF > .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${VAPID_PUBLIC}
VAPID_PRIVATE_KEY=${VAPID_PRIVATE}

NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=${AUTH_SECRET}

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
ADMIN_EMAIL=
EOF
  echo -e "${GREEN}Created .env.local with generated VAPID keys and NextAuth secrets!${NC}"
else
  echo ".env.local already exists, skipping generation."
fi

# 4. Database Setup & Sync
echo -e "\n${YELLOW}[4/6] Initializing databases...${NC}"

# Create PostgreSQL Auth DB if not exist
echo "Creating auth database 'shunature_auth' if not exists..."
pg_password_env=""
if [ -n "$PG_PASS" ]; then
  export PGPASSWORD="$PG_PASS"
fi
psql -U "$PG_USER" -h "$PG_HOST" -tc "SELECT 1 FROM pg_database WHERE datname = 'shunature_auth'" | grep -q 1 || \
psql -U "$PG_USER" -h "$PG_HOST" -c "CREATE DATABASE shunature_auth"

# Sync Prisma Schema
echo "Running Prisma migrations..."
npx prisma db push
npx prisma generate

# Setup Rails DB
echo "Running Rails migrations and seeds..."
cd cms
bundle exec rails db:create db:migrate db:seed
cd ..

# 5. Production Build
echo -e "\n${YELLOW}[5/6] Building Next.js application for production...${NC}"
npm run build

# 6. Setup Completion and Run Instructions
echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}   Deployment setup complete!                         ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "\nTo start the applications in production:"
echo -e "\n${YELLOW}1. Run the Rails API (defaulting to Port 3001):${NC}"
echo -e "   cd cms && RAILS_ENV=production bundle exec rails server -p 3001 -b 0.0.0.0"
echo -e "\n${YELLOW}2. Run the Next.js frontend (defaulting to Port 3000):${NC}"
echo -e "   npm run start"
echo -e "\n${YELLOW}Recommended for production hosting:${NC}"
echo -e "   - Setup Nginx to reverse proxy 'api.ffnet.work' to Port 3001."
echo -e "   - Setup Nginx to reverse proxy 'shunature.one' to Port 3000."
echo -e "   - Use a process manager like PM2 to keep Next.js and Rails active in the background."
echo -e "\n${YELLOW}Make sure to fill in GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env.local to enable Admin access.${NC}\n"
EOF
