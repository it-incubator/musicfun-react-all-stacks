export const formatCreatedDate = (addedAt: string | undefined) => {
    if (!addedAt) {
        return
    }
    const date = new Date(addedAt.toString())
    const now = new Date()
    const differTime = now.getTime() - date.getTime()
    const differDays = Math.floor(differTime / (1000 * 60 * 60 * 24))
    if (differDays === 0) {
        return 'today'
    }

    return `${differDays} ${differDays === 1 ? 'day' : 'days'} ago`
}