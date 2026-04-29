#!/bin/bash

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 EcoStore Quick Setup${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found${NC}"

# Install dependencies
echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Check .env.local
echo -e "\n${BLUE}🔐 Checking configuration...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ .env.local found${NC}"
else
    echo -e "${YELLOW}⚠ .env.local not found${NC}"
    echo "Creating from template..."
    cp .env.example .env.local 2>/dev/null || echo "Please create .env.local manually"
fi

# Show summary
echo -e "\n${GREEN}✅ Setup Complete!${NC}\n"
echo -e "${BLUE}Next steps:${NC}"
echo "1. Create tables in Supabase (see SETUP_GUIDE.md)"
echo "2. Start server: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo -e "${YELLOW}📖 Read SETUP_GUIDE.md for detailed instructions${NC}\n"
