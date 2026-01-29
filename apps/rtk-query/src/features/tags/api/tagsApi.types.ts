export type Tag = {
  id: string
  name: string
}

// JSON:API format types
export type TagAttributes = {
  name: string
}

export type TagResource = {
  id: string
  type: 'tags'
  attributes: TagAttributes
}

export type GetTagsResponse = {
  data: TagResource[]
}

export type GetTagResponse = {
  data: TagResource
}

export type CreateTagRequest = {
  data: {
    type: 'tags'
    attributes: TagAttributes
  }
}
