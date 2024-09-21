#!/bin/bash

# Remove node_modules and package-lock.json
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

echo "Clean install completed."