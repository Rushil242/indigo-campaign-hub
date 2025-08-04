import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get secrets from Supabase
    const googleServiceAccount = Deno.env.get('GOOGLE_SERVICE_ACCOUNT')
    const templatesUrl = Deno.env.get('TEMPLATES_URL')

    if (!googleServiceAccount || !templatesUrl) {
      throw new Error('Missing required environment variables')
    }

    // Parse Google service account
    const googleCreds = JSON.parse(googleServiceAccount)
    
    // Generate ID token for templates URL
    const token = await generateIdToken(googleCreds, templatesUrl)
    
    // Fetch templates from the secure endpoint
    const response = await fetch(templatesUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const templates = await response.json()
    
    return new Response(
      JSON.stringify({ success: true, templates }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function generateIdToken(googleCreds: any, audience: string): Promise<string> {
  // This is a simplified implementation
  // In production, use google-auth-library or similar
  const now = Math.floor(Date.now() / 1000)
  
  const header = btoa(JSON.stringify({
    alg: "RS256",
    typ: "JWT",
    kid: googleCreds.private_key_id
  }))
  
  const payload = btoa(JSON.stringify({
    iss: googleCreds.client_email,
    sub: googleCreds.client_email,
    aud: audience,
    iat: now,
    exp: now + 3600
  }))
  
  // For demo purposes, return a mock token
  // In production, properly sign with the private key
  return `${header}.${payload}.signature`
}