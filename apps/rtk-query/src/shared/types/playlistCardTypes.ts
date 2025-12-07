import {CurrentUserReaction} from "@/shared/components";

export type PlaylistCardPropsBase = {
    id: string
    title: string
    imageSrc?: string
    actions?: React.ReactNode
    userName: string
    userId: string
    addedAt: string
}

export type PlaylistCardPropsWithReactions = PlaylistCardPropsBase & {
    isShowReactionButtons: true
    reaction: CurrentUserReaction
    likesCount: number
}

export type PlaylistCardPropsWithoutReactions = PlaylistCardPropsBase & {
    isShowReactionButtons?: false
}

export type PlaylistCardProps = PlaylistCardPropsWithReactions | PlaylistCardPropsWithoutReactions