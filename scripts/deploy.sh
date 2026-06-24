#!/bin/bash
# Deploy to Vercel with env vars
TOKEN=*** -c "import json; print(json.load(open('/home/chino/.vercel/auth.json'))['token'])")

cd ~/web-projects/tennis-matchmaker

# Set anon key - pipe from echo
# The anon key provided by the user - full version
echo "eyJhbG...Ybfs" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --token "$TOKEN" --yes

echo "Env vars set. Deploying..."
vercel --token "$TOKEN" --prod --yes
