import { httpApiInterceptor } from '@/shared/api/api-root/api-root-instanse'
import { API_PREFIX_ROOT } from '@/shared/api/api-root/api-root'
import { ResponseLoginT } from '@/features/auth/model/types/api.types'

export default class AuthPlaylistInstance {
  private static api = httpApiInterceptor(API_PREFIX_ROOT.PLAYLISTS)

  static getPlaylist() {
    return this.api.get<ResponseLoginT>('')
  }
}
