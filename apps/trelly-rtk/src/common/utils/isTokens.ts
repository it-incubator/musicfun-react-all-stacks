export const isTokens = (data: unknown): data is { accessToken: string; refreshToken: string } => {
  return typeof data === "object" && data !== null && "accessToken" in data && "refreshToken" in data
}
