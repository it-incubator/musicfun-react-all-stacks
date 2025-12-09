import { ResponseLoginT } from '@/features/auth/model/types/api.types'
import { API_PREFIX_ROOT } from '@/shared/api/api-root/api-root'
import { httpApiInterceptor } from '@/shared/api/api-root/api-root-instanse'

export default class AuthPlaylistInstance {
  private static api = httpApiInterceptor(API_PREFIX_ROOT.PLAYLISTS)

  static getPlaylist() {
    return this.api.get<ResponseLoginT>('')
  }
}
