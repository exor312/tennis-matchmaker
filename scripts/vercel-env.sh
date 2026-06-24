#!/bin/bash
TOKEN=$(python3 -c "import json; print(json.load(open('/home/chino/.vercel/auth.json'))['token'])")
ANON_KEY=$(python3 -c "
import json
# Read the anon key from a file where the user pasted it
# or extract from the known value
print('eyJhbG...Ybfs')
")

cd ~/web-projects/tennis-matchmaker

# Set anon key
printf "$ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --token "$TOKEN" --yes
