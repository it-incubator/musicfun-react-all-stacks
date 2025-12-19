import {useParams} from 'react-router'

import {useMeQuery} from '@/features/auth'
import {useFetchPlaylistsQuery} from '@/features/playlists'
import {useFetchTracksQuery} from '@/features/tracks'

export const useOwnerData = () => {
    const {data: user, isLoading} = useMeQuery()
    const {userId: pageOwnerId} = useParams()
    const isProfileOwner = user?.userId === pageOwnerId

    const {data: tracks} = useFetchTracksQuery(
        {
            pageSize: 10,
            pageNumber: 1,
            userId: pageOwnerId,
            includeDrafts: isProfileOwner ? true : undefined,
        },
        {skip: isLoading}
    )

    const {data: playlists} = useFetchPlaylistsQuery({userId: pageOwnerId}, {skip: isLoading})

    let userLogin = isProfileOwner ? user?.login : ''

    if (!isProfileOwner && playlists?.data[0]) {
        userLogin = playlists.data[0].attributes.user.name
    }

    if (!isProfileOwner && !playlists?.data[0] && tracks?.data[0]) {
        userLogin = tracks.data[0].attributes.user.name
    }

    return {isProfileOwner, userLogin, tracks, playlists}
}
