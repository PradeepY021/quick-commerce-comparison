#!/bin/bash

# QuickCommerce Compare - Sharing Helper Script

echo "🚀 QuickCommerce Compare - Sharing Options"
echo "=========================================="
echo ""

# Get local IP address
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Unable to detect")

if [ "$LOCAL_IP" != "Unable to detect" ]; then
  echo "📍 Your local IP address: $LOCAL_IP"
  echo ""
  echo "📱 To share on the same WiFi network:"
  echo "   Frontend: http://$LOCAL_IP:3002"
  echo "   Backend:  http://$LOCAL_IP:3000"
  echo ""
  echo "   Share these URLs with others on your network!"
  echo ""
else
  echo "⚠️  Could not detect your local IP automatically."
  echo "   Run this command to find it:"
  echo "   ipconfig getifaddr en0"
  echo ""
fi

echo "☁️  For cloud deployment (recommended for sharing):"
echo "   1. Frontend: Deploy to Vercel or Netlify"
echo "   2. Backend: Deploy to Railway or Render"
echo ""
echo "   See SHARING_GUIDE.md for detailed instructions"
echo ""

echo "🔗 Alternative tunneling options (no ngrok):"
echo "   - Cloudflare Tunnel: cloudflared tunnel --url http://localhost:3002"
echo "   - LocalTunnel: npm install -g localtunnel && lt --port 3002"
echo ""

