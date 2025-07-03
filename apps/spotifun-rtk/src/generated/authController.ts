import { baseApi as api } from "../app/api/base-api"
export const addTagTypes = ["Authentication"] as const
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      authControllerOauthRedirect: build.query<AuthControllerOauthRedirectResponse, AuthControllerOauthRedirectArgs>({
        query: (queryArg) => ({
          url: `/api/1.0/auth/oauth-redirect`,
          params: {
            callbackUrl: queryArg.callbackUrl,
          },
        }),
        providesTags: ["Authentication"],
      }),
      authControllerLogin: build.mutation<AuthControllerLoginResponse, AuthControllerLoginArgs>({
        query: (queryArg) => ({ url: `/api/1.0/auth/login`, method: "POST", body: queryArg.loginRequestPayload }),
        invalidatesTags: ["Authentication"],
      }),
      authControllerRefresh: build.mutation<AuthControllerRefreshResponse, AuthControllerRefreshArgs>({
        query: (queryArg) => ({ url: `/api/1.0/auth/refresh`, method: "POST", body: queryArg.refreshRequestPayload }),
        invalidatesTags: ["Authentication"],
      }),
      authControllerLogout: build.mutation<AuthControllerLogoutResponse, AuthControllerLogoutArgs>({
        query: (queryArg) => ({ url: `/api/1.0/auth/logout`, method: "POST", body: queryArg.logoutRequestPayload }),
        invalidatesTags: ["Authentication"],
      }),
      authControllerGetMe: build.query<AuthControllerGetMeResponse, AuthControllerGetMeArgs>({
        query: () => ({ url: `/api/1.0/auth/me` }),
        providesTags: ["Authentication"],
      }),
    }),
    overrideExisting: false,
  })
export { injectedRtkApi as generatedApi }
export type AuthControllerOauthRedirectResponse = unknown
export type AuthControllerOauthRedirectArgs = {
  /** The callback URL to redirect after grand access,
         https://oauth.apihub.it-incubator.io/realms/apihub/protocol/openid-connect/auth?client_id=spotifun&response_type=code&redirect_uri=http://localhost:3000/oauth2/callback&scope=openid */
  callbackUrl?: string
}
export type AuthControllerLoginResponse = /** status 200 OK: Успешно получена пара токенов */ RefreshResponseDto
export type AuthControllerLoginArgs = {
  loginRequestPayload: LoginRequestPayload
}
export type AuthControllerRefreshResponse = /** status 200 OK: Успешное обновление пары токенов */ RefreshResponseDto
export type AuthControllerRefreshArgs = {
  refreshRequestPayload: RefreshRequestPayload
}
export type AuthControllerLogoutResponse = unknown
export type AuthControllerLogoutArgs = {
  logoutRequestPayload: LogoutRequestPayload
}
export type AuthControllerGetMeResponse =
  /** status 200 OK: Успешное получение информации о пользователе */ MeResponseDto
export type AuthControllerGetMeArgs = void
export type RefreshResponseDto = {
  refreshToken: string
  accessToken: string
}
export type BadRequestException = {}
export type UnauthorizedException = {}
export type LoginRequestPayload = {
  /** Код, полученный от oauth-сервер после редиректа */
  code: string
  /** Укажите тоже значение, что и во время первого запроса на oauth-сервер */
  redirectUri: string
  /** Срок жизни accessToken-а (по дефолту "3m"), Можно использовать значение в формате: be a string like "60s", "3m", "2h", "1d" */
  accessTokenTTL: string
  /** Как долго будет жить refreshToken. Если true - 1 месяц, если false - 30 минут. Явно указанный accessTokenTTL не должен быть больше, чем время жизни refreshToken */
  rememberMe: boolean
}
export type RefreshRequestPayload = {
  refreshToken: string
}
export type LogoutRequestPayload = {
  refreshToken: string
}
export type MeResponseDto = {
  userId: string
  login: string
}
export const {
  useAuthControllerOauthRedirectQuery,
  useAuthControllerLoginMutation,
  useAuthControllerRefreshMutation,
  useAuthControllerLogoutMutation,
  useAuthControllerGetMeQuery,
} = injectedRtkApi
