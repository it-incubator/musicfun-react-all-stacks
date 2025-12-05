export const baseUrl = process.env.BASE_URL!
export const apiKey = process.env.API_KEY!

export const jsonHeaders = {
  'Content-Type': 'application/json',
  'api-Key': apiKey,
  Origin: 'http://localhost:3000',
}

export const formHeaders = {
  'api-Key': apiKey,
}

export const redirectAfterOauthUri = 'http://localhost:3000/api/oauth/callback'
