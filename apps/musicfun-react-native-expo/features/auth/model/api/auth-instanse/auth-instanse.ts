import { httpApiInterceptor } from '@/shared/api/api-root/api-root-instanse'
import { API_PREFIX_ROOT } from '@/shared/api/api-root/api-root'
import { ResMeT } from '@/features/auth/model/types/api.types'
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export default class apiAuthInstance {
  private static api = httpApiInterceptor(API_PREFIX_ROOT.AUTH)

  static me() {
    return this.api.get<ResMeT>('/me')
  }
}
