#!/bin/bash

# SoundStyle Development Server with HTTPS via ngrok
# This script starts the Next.js dev server and creates an HTTPS tunnel

set -e

echo "🎵 Starting SoundStyle Development Environment"
echo "=============================================="
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok not found. Installing..."
    brew install ngrok
fi

# Kill any existing processes on port 3000
echo "🧹 Cleaning up port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start Next.js dev server in background
echo "🚀 Starting Next.js dev server..."
npm run dev &
NEXT_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Server failed to start"
    kill $NEXT_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Next.js server running on http://localhost:3000"
echo ""

# Start ngrok tunnel
echo "🔒 Creating HTTPS tunnel with ngrok..."
echo ""
echo "📌 IMPORTANT: Copy the HTTPS URL below and add it to your Spotify Dashboard:"
echo "   https://developer.spotify.com/dashboard"
echo ""
echo "   Redirect URI to add: https://YOUR-NGROK-URL.ngrok-free.app/api/auth/spotify/callback"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=============================================="
echo ""

# Start ngrok (this will show the URL in the terminal)
ngrok http 3000

# Cleanup on exit
trap "kill $NEXT_PID 2>/dev/null || true" EXIT
