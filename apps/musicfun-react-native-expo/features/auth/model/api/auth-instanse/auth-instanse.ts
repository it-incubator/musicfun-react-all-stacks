import { httpApiInterceptor } from '@/shared/api/api-root/api-root-instanse'
import { API_PREFIX_ROOT } from '@/shared/api/api-root/api-root'

export default class apiAuthInstance {
  static apiAuthInstance = httpApiInterceptor(API_PREFIX_ROOT.TEST)

  static getLogin = () => this.apiAuthInstance.get('/login')

  static postLogin = () => this.apiAuthInstance.post('/login')
}
