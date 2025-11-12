import { httpApiInterceptor } from '@/shared/api/api-root/api-root-instanse'
import { API_PREFIX_ROOT } from '@/shared/api/api-root/api-root'
import { RequestLoginT, RequestLogoutT, ResMeT, ResponseLoginT } from '@/features/auth/model/types/api.types'

export default class apiAuthInstance {
  private static api = httpApiInterceptor(API_PREFIX_ROOT.AUTH)

  static me() {
    return this.api.get<ResMeT>('me')
  }
  static login(arg: RequestLoginT) {
    return this.api.post<ResponseLoginT>('/login', {
      code: arg.code,
      redirectUri: arg.redirectUri,
      accessTokenTTL: arg.accessTokenTTL,
      rememberMe: arg.rememberMe,
    })
  }
  static logout(arg: RequestLogoutT) {
    return this.api.post('/logout', {
      refreshToken: arg.refreshToken,
      rememberMe: arg.rememberMe,
      accessTokenTTL: arg.accessTokenTTL,
      redirectUri: arg.redirectUri,
    })
  }
}
