export function expoUrlToHttpCallback(expoUrl: string): string {
  try {
    // убираем префикс exp://
    const url = expoUrl.replace(/^exp:\/\//, '')
    return `http://${url}/oauth/callback`
  } catch {
    throw new Error('Invalid expo URL')
  }
}
