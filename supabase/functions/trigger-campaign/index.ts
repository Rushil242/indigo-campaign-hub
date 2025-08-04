import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sheetSource, templateId } = await req.json()
    
    // Get secrets from Supabase
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')
    const googleServiceAccount = Deno.env.get('GOOGLE_SERVICE_ACCOUNT')
    const triggerUrl = Deno.env.get('TRIGGER_URL')

    if (!twilioAccountSid || !twilioAuthToken || !googleServiceAccount || !triggerUrl) {
      throw new Error('Missing required environment variables')
    }

    // Parse Google service account
    const googleCreds = JSON.parse(googleServiceAccount)
    
    // Create JWT for Google authentication
    const now = Math.floor(Date.now() / 1000)
    const header = {
      alg: "RS256",
      typ: "JWT"
    }
    
    const payload = {
      iss: googleCreds.client_email,
      sub: googleCreds.client_email,
      aud: triggerUrl,
      iat: now,
      exp: now + 3600 // 1 hour
    }

    // For this demo, we'll use a simplified approach
    // In production, you'd use a proper JWT library
    const token = await generateIdToken(googleCreds, triggerUrl)
    
    // Call the trigger URL with authentication
    const response = await fetch(triggerUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sheetSource, templateId })
    })

    const result = await response.json()
    
    return new Response(
      JSON.stringify({ success: true, data: result }),
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